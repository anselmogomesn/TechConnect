import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { NotFoundError, ConflictError, ValidationError, UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';
import config from '../config';
import { gamificationService } from './gamification.service';

export class UserService {
  async getProfile(username: string, currentUserId?: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true, name: true, surname: true, username: true, bio: true,
        avatar: true, banner: true, website: true, location: true, birthDate: true,
        role: true, status: true, level: true, xp: true, totalXpEarned: true,
        reputation: true, title: true, followersCount: true, followingCount: true,
        postsCount: true, likesReceived: true, commentsCount: true,
        sharesCount: true, streakCount: true, emailVerified: true,
        lastActivity: true, createdAt: true,
        badges: {
          include: { badge: true },
          orderBy: { earnedAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user || user.status === 'DELETED') throw new NotFoundError('User not found');

    let isFollowing = false;
    if (currentUserId) {
      const follow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: currentUserId, followingId: user.id } },
      });
      isFollowing = !!follow;
    }

    // Get next level info
    const currentLevel = await prisma.level.findUnique({ where: { level: user.level } });
    const nextLevel = await prisma.level.findUnique({ where: { level: user.level + 1 } });

    const xpForCurrentLevel = currentLevel?.xpRequired || 0;
    const xpForNextLevel = nextLevel?.xpRequired || (xpForCurrentLevel + Math.floor(100 * Math.pow(user.level + 1, 1.5) + user.level * 100));
    const xpProgress = user.xp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const xpProgressPercent = xpNeeded > 0 ? Math.min(Math.round((xpProgress / xpNeeded) * 100), 100) : 100;

    // Get achievements count
    const achievementsCount = await prisma.userAchievement.count({
      where: { userId: user.id, completed: true },
    });

    return {
      ...user,
      isFollowing,
      badges: user.badges.map((b) => ({ ...b.badge, earnedAt: b.earnedAt })),
      badgesCount: user.badges.length,
      achievementsCount,
      nextLevel: user.level + 1,
      xpProgress,
      xpNeeded,
      xpProgressPercent,
      nextLevelTitle: nextLevel?.title || null,
    };
  }

  async updateProfile(userId: string, data: {
    name?: string; surname?: string; bio?: string;
    website?: string; location?: string; birthDate?: string;
  }) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.surname !== undefined) updateData.surname = data.surname;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.birthDate !== undefined) updateData.birthDate = new Date(data.birthDate);

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true, name: true, surname: true, username: true, bio: true,
        avatar: true, banner: true, website: true, location: true, birthDate: true,
        email: true, role: true, level: true, xp: true, updatedAt: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });
    if (!user) throw new NotFoundError('User not found');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new UnauthorizedError('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    await prisma.auditLog.create({
      data: { userId, action: 'PASSWORD_CHANGED', entity: 'User', entityId: userId, severity: 'INFO' },
    });

    logger.info(`Password changed for user ${userId}`);
  }

  async updateAvatar(userId: string, filename: string) {
    const avatarUrl = `/uploads/avatars/${filename}`;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: { id: true, avatar: true },
    });

    // Award XP + check profile completion
    await gamificationService.awardXp(userId, 25, 'Adicionou foto de perfil');
    await gamificationService.onProfileCompleted(userId);
    return user;
  }

  async updateBanner(userId: string, filename: string) {
    const bannerUrl = `/uploads/banners/${filename}`;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { banner: bannerUrl },
      select: { id: true, banner: true },
    });

    await gamificationService.awardXp(userId, 25, 'Adicionou banner');
    return user;
  }

  async updateUsername(userId: string, newUsername: string) {
    const existing = await prisma.user.findUnique({ where: { username: newUsername } });
    if (existing && existing.id !== userId) throw new ConflictError('Username already taken');

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(newUsername)) {
      throw new ValidationError({ username: ['Invalid username format'] });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername.toLowerCase() },
      select: { id: true, username: true },
    });

    return user;
  }

  async getSessions(userId: string) {
    const sessions = await prisma.session.findMany({
      where: { userId, isRevoked: false },
      select: { id: true, ip: true, userAgent: true, location: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return sessions;
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundError('Session not found');

    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true, revokedAt: new Date(), revokedBy: 'user' },
    });
  }

  async setup2FA(userId: string) {
    const speakeasy = require('speakeasy');
    const secret = speakeasy.generateSecret({ name: `Anselmo:${userId}` });

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    return { secret: secret.base32, otpauthUrl: secret.otpauth_url };
  }

  async enable2FA(userId: string, token: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });
    if (!user?.twoFactorSecret) throw new NotFoundError('2FA not set up');

    const speakeasy = require('speakeasy');
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) throw new ValidationError({ token: ['Invalid code'] });

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    await prisma.auditLog.create({
      data: { userId, action: '2FA_ENABLED', entity: 'User', entityId: userId, severity: 'INFO' },
    });
  }

  async disable2FA(userId: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) throw new NotFoundError('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('Password is incorrect');

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: null, twoFactorEnabled: false },
    });

    await prisma.auditLog.create({
      data: { userId, action: '2FA_DISABLED', entity: 'User', entityId: userId, severity: 'WARNING' },
    });
  }

  async toggleFollow(followerId: string, followingUsername: string) {
    const target = await prisma.user.findUnique({ where: { username: followingUsername } });
    if (!target) throw new NotFoundError('User not found');
    if (target.id === followerId) throw new ValidationError({ follow: ['Cannot follow yourself'] });
    if (target.status === 'DELETED') throw new NotFoundError('User not found');

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId: target.id } },
    });

    if (existing) {
      // Unfollow
      await prisma.follow.delete({ where: { id: existing.id } });
      await prisma.user.update({ where: { id: followerId }, data: { followingCount: { decrement: 1 } } });
      await prisma.user.update({ where: { id: target.id }, data: { followersCount: { decrement: 1 } } });
      return { following: false };
    }

    // Follow
    await prisma.follow.create({ data: { followerId, followingId: target.id } });
    await prisma.user.update({ where: { id: followerId }, data: { followingCount: { increment: 1 } } });
    await prisma.user.update({ where: { id: target.id }, data: { followersCount: { increment: 1 } } });

    // Award XP + check follow badges
    await gamificationService.awardXp(followerId, 5, 'Seguiu um usuário');
    await gamificationService.onFollowReceived(target.id);

    return { following: true };
  }
}

export const userService = new UserService();
