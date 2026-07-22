// ============================================
// TechConnect - Auth Service
// ============================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import prisma from '../config/prisma';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  TooManyRequestsError,
} from '../utils/errors';
import { logger } from '../utils/logger';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { gamificationService } from './gamification.service';

export class AuthService {
  // ============================================
  // REGISTER
  // ============================================
  async register(input: RegisterInput) {
    const { email, password, name, surname, username } = input;

    // Check existing email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new ConflictError('Email already registered');
    }

    // Check existing username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptSaltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        username,
        // Award XP for creating account
        xp: 50,
        totalXpEarned: 50,
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        username: true,
        role: true,
        status: true,
        level: true,
        xp: true,
        createdAt: true,
      },
    });

    // Create XP history
    await prisma.xpHistory.create({
      data: {
        userId: user.id,
        amount: 50,
        reason: 'Criar conta',
        total: 50,
      },
    });

    // Check achievements for new user
    await gamificationService.checkAchievements(user.id, 'xp', 50);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    logger.info(`New user registered: ${user.email} (${user.id})`);

    return { user, ...tokens };
  }

  // ============================================
  // LOGIN
  // ============================================
  async login(input: LoginInput, ip?: string, userAgent?: string) {
    const { email, password, twoFactorCode } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        surname: true,
        username: true,
        role: true,
        status: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        level: true,
        xp: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check user status
    if (user.status === 'BANNED') {
      throw new UnauthorizedError('Account is banned');
    }

    if (user.status === 'DELETED') {
      throw new UnauthorizedError('Account not found');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await this.recordFailedLogin(user.id, ip);
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check 2FA
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return { requiresTwoFactor: true, userId: user.id };
      }
      // Verify 2FA code
      const speakeasy = require('speakeasy');
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1,
      });
      if (!verified) {
        throw new UnauthorizedError('Invalid 2FA code');
      }
    }

    // Update login stats
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastActivity: new Date(),
        loginCount: { increment: 1 },
        // Daily streak
        ...this.calculateStreak(user.id),
      },
    });

    // Gamification: daily login XP + streak badges
    await gamificationService.awardXp(user.id, 10, 'Login diário');
    await gamificationService.onDailyLogin(user.id);

    // Log successful login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
        details: JSON.stringify({ method: 'password', twoFactorUsed: !!twoFactorCode }),
        ip,
        userAgent,
        severity: 'INFO',
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        username: user.username,
        role: user.role,
        level: user.level,
        xp: user.xp,
        avatar: user.avatar,
      },
      ...tokens,
      requiresTwoFactor: false,
    };
  }

  // ============================================
  // REFRESH TOKEN
  // ============================================
  async refreshToken(refreshToken: string) {
    // Find session with this refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!session || session.isRevoked) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (new Date() > session.expiresAt) {
      await prisma.session.update({
        where: { id: session.id },
        data: { isRevoked: true, revokedAt: new Date() },
      });
      throw new UnauthorizedError('Refresh token expired');
    }

    if (session.user.status === 'BANNED') {
      throw new UnauthorizedError('Account is banned');
    }

    // Revoke old session
    await prisma.session.update({
      where: { id: session.id },
      data: { isRevoked: true, revokedAt: new Date() },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(
      session.user.id,
      session.user.email,
      session.user.role
    );

    return tokens;
  }

  // ============================================
  // LOGOUT
  // ============================================
  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { isRevoked: true, revokedAt: new Date(), revokedBy: 'logout' },
      });
    } else {
      // Revoke all sessions for user
      await prisma.session.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true, revokedAt: new Date(), revokedBy: 'logout' },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'USER_LOGOUT',
        entity: 'User',
        entityId: userId,
        severity: 'INFO',
      },
    });
  }

  // ============================================
  // TOKEN GENERATION
  // ============================================
  private async generateTokens(userId: string, email: string, role: string) {
    const sessionId = uuidv4();
    const jti = uuidv4();

    // Access token (short-lived)
    const accessToken = jwt.sign(
      { userId, email, role, sessionId, jti },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    // Refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId, email, role, sessionId, jti, type: 'refresh' },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn as any }
    );

    // Store session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.session.create({
      data: {
        id: sessionId,
        userId,
        token: accessToken,
        refreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken, sessionId };
  }

  // ============================================
  // FAILED LOGIN TRACKING
  // ============================================
  private async recordFailedLogin(userId: string, ip?: string) {
    const key = `login_attempts:${userId}`;

    // Simple brute force protection using audit log
    const recentAttempts = await prisma.auditLog.count({
      where: {
        userId,
        action: 'LOGIN_FAILED',
        createdAt: {
          gte: new Date(Date.now() - config.security.loginBlockDurationMinutes * 60 * 1000),
        },
      },
    });

    if (recentAttempts >= config.security.maxLoginAttempts - 1) {
      logger.warn(`Brute force attempt detected for user ${userId}`);
      throw new TooManyRequestsError(
        `Too many login attempts. Please try again in ${config.security.loginBlockDurationMinutes} minutes.`
      );
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGIN_FAILED',
        entity: 'User',
        entityId: userId,
        details: JSON.stringify({ ip }),
        ip,
        severity: 'WARNING',
      },
    });
  }

  // ============================================
  // STREAK CALCULATION
  // ============================================
  private calculateStreak(userId: string) {
    // This will be called during login
    return {};
  }
}

export const authService = new AuthService();
