import prisma from '../config/prisma';
import { logger } from '../utils/logger';
import { getIO, sendNotification } from '../socket';

export class GamificationService {
  // ============================================
  // AWARD XP
  // ============================================
  async awardXp(userId: string, amount: number, reason: string, refType?: string, refId?: string) {
    await prisma.xpHistory.create({
      data: { userId, amount, reason, referenceType: refType, referenceId: refId, total: amount },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: amount }, totalXpEarned: { increment: amount } },
    });
    await this.checkLevelUp(userId);
    await this.checkAchievements(userId, 'xp', amount);
  }

  private async checkLevelUp(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });
    if (!user) return;

    // Calculate target level directly: find highest level whose xpRequired <= user.xp
    const targetLevel = await prisma.level.findFirst({
      where: { xpRequired: { lte: user.xp } },
      orderBy: { level: 'desc' },
    });

    if (!targetLevel || targetLevel.level <= user.level) return;

    // Jump directly to target level
    await prisma.user.update({
      where: { id: userId },
      data: { level: targetLevel.level, title: targetLevel.title || undefined },
    });

    const levelUpXp = targetLevel.level * 10;
    await prisma.xpHistory.create({
      data: { userId, amount: levelUpXp, reason: `Subiu para nível ${targetLevel.level}`, total: user.xp + levelUpXp },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: levelUpXp }, totalXpEarned: { increment: levelUpXp } },
    });

    logger.info(`User ${userId} leveled up to ${targetLevel.level}`);

    try {
      const io = getIO();
      io.to(`user:${userId}`).emit('level_up', { level: targetLevel.level, title: targetLevel.title });
    } catch {}

    await this.checkAchievements(userId, 'level', targetLevel.level);
  }

  // ============================================
  // AWARD BADGES
  // ============================================
  async awardBadge(userId: string, badgeSlug: string) {
    const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
    if (!badge) return;

    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });
    if (existing) return;

    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });

    // Award XP
    if (badge.xpReward > 0) {
      await this.awardXp(userId, badge.xpReward, `Badge: ${badge.name}`, 'Badge', badge.id);
    }

    logger.info(`Badge awarded: ${badgeSlug} to user ${userId}`);

    // Notify
    try {
      const io = getIO();
      io.to(`user:${userId}`).emit('badge_earned', { badge: badge.name, rarity: badge.rarity, xp: badge.xpReward });
    } catch {}
  }

  // ============================================
  // ACHIEVEMENTS
  // ============================================
  async checkAchievements(userId: string, event: string, value: number) {
    const achievements = await prisma.achievement.findMany();
    const userAchs = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true, completed: true, progress: true },
    });
    const userAchMap = new Map(userAchs.map((a) => [a.achievementId, a]));

    for (const ach of achievements) {
      if (userAchMap.get(ach.id)?.completed) continue;

      let criteria: any = {};
      try { criteria = JSON.parse(ach.criteria || '{}'); } catch { continue; }

      let currentProgress = userAchMap.get(ach.id)?.progress || 0;
      let changed = false;

      // XP total
      if (criteria.event === 'xp' && event === 'xp') {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { totalXpEarned: true } });
        if (user) {
          const newProgress = Math.min(user.totalXpEarned, ach.maxProgress);
          if (newProgress !== currentProgress) { currentProgress = newProgress; changed = true; }
        }
      }

      // Level
      if (criteria.event === 'level' && event === 'level') {
        if (value >= ach.maxProgress && currentProgress < ach.maxProgress) {
          currentProgress = ach.maxProgress; changed = true;
        }
      }

      // Posts count
      if (criteria.event === 'posts_count') {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { postsCount: true } });
        if (user) {
          const newProgress = Math.min(user.postsCount, ach.maxProgress);
          if (newProgress !== currentProgress) { currentProgress = newProgress; changed = true; }
        }
      }

      if (!changed) continue;

      const completed = currentProgress >= ach.maxProgress;
      await prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId: ach.id } },
        update: { progress: currentProgress, completed, completedAt: completed ? new Date() : null },
        create: { userId, achievementId: ach.id, progress: currentProgress, completed, completedAt: completed ? new Date() : null },
      });

      if (completed && ach.xpReward > 0) {
        await this.awardXp(userId, ach.xpReward, `Conquista: ${ach.name}`, 'Achievement', ach.id);
        logger.info(`Achievement completed: ${ach.slug} by user ${userId}`);
        try {
          const io = getIO();
          io.to(`user:${userId}`).emit('achievement_earned', { achievement: ach.name, xp: ach.xpReward });
        } catch {}
      }
    }
  }

  // ============================================
  // MISSIONS
  // ============================================
  async updateMissionProgress(userId: string, missionSlug: string, progressIncrement = 1) {
    const mission = await prisma.mission.findUnique({ where: { slug: missionSlug } });
    if (!mission || !mission.isActive) return;

    const userMis = await prisma.userMission.findUnique({
      where: { userId_missionId: { userId, missionId: mission.id } },
    });

    const currentProgress = userMis?.progress || 0;
    const newProgress = Math.min(currentProgress + progressIncrement, mission.maxProgress);
    const completed = newProgress >= mission.maxProgress && !userMis?.completed;

    await prisma.userMission.upsert({
      where: { userId_missionId: { userId, missionId: mission.id } },
      update: { progress: newProgress, completed, completedAt: completed ? new Date() : undefined },
      create: { userId, missionId: mission.id, progress: newProgress, completed, completedAt: completed ? new Date() : undefined },
    });

    if (completed && mission.xpReward > 0) {
      await this.awardXp(userId, mission.xpReward, `Missão: ${mission.name}`, 'Mission', mission.id);
      logger.info(`Mission completed: ${missionSlug} by user ${userId}`);
      try {
        const io = getIO();
        io.to(`user:${userId}`).emit('mission_complete', { mission: mission.name, xp: mission.xpReward });
      } catch {}
    }
  }

  // ============================================
  // CHECK ALL TRIGGERS (called after actions)
  // ============================================
  async onPostCreated(userId: string) {
    // Badges
    const count = await prisma.post.count({ where: { userId, deletedAt: null } });
    if (count >= 1) await this.awardBadge(userId, 'first-post');
    if (count >= 50) await this.awardBadge(userId, 'writer');
    if (count >= 200) await this.awardBadge(userId, 'best-seller');

    // Missions
    await this.updateMissionProgress(userId, 'daily-post');
    await this.updateMissionProgress(userId, 'weekly-posts');
    await this.updateMissionProgress(userId, 'monthly-content');

    // Achievements
    await this.checkAchievements(userId, 'posts_count', count);
    await this.checkAchievements(userId, 'xp', 0);
  }

  async onCommentCreated(userId: string) {
    const count = await prisma.comment.count({ where: { userId, deletedAt: null } });
    if (count >= 100) await this.awardBadge(userId, 'comment-master');

    await this.updateMissionProgress(userId, 'daily-comment');
    await this.checkAchievements(userId, 'xp', 0);
  }

  async onLikeReceived(postUserId: string) {
    const count = await prisma.user.findUnique({ where: { id: postUserId }, select: { likesReceived: true } });
    if (!count) return;

    if (count.likesReceived >= 1) await this.awardBadge(postUserId, 'first-like');
    if (count.likesReceived >= 100) await this.awardBadge(postUserId, '100-likes');

    await this.updateMissionProgress(postUserId, 'daily-like');
    await this.updateMissionProgress(postUserId, 'weekly-engagement');
    await this.updateMissionProgress(postUserId, 'monthly-engagement');
    await this.checkAchievements(postUserId, 'xp', 0);
  }

  async onFollowReceived(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { followersCount: true } });
    if (!user) return;

    if (user.followersCount >= 1) await this.awardBadge(userId, 'first-follower');
    if (user.followersCount >= 500) await this.awardBadge(userId, '500-followers');
    if (user.followersCount >= 1000) await this.awardBadge(userId, '1000-followers');

    await this.updateMissionProgress(userId, 'weekly-follow');
    await this.updateMissionProgress(userId, 'monthly-growth');
    await this.checkAchievements(userId, 'xp', 0);
  }

  async onProfileCompleted(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { bio: true, avatar: true, website: true, location: true },
    });
    if (!user) return;

    if (user.bio && user.avatar && user.website && user.location) {
      await this.awardBadge(userId, 'profile-complete');
    }
    await this.checkAchievements(userId, 'xp', 0);
  }

  async onDailyLogin(userId: string) {
    await this.updateMissionProgress(userId, 'daily-login');
    await this.checkAchievements(userId, 'xp', 0);

    // Streak badges
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { streakCount: true } });
    if (!user) return;
    if (user.streakCount >= 7) await this.awardBadge(userId, 'dedicated');
    if (user.streakCount >= 30) await this.awardBadge(userId, 'marathon');
    if (user.streakCount >= 100) await this.awardBadge(userId, 'legend');
  }

  async onCommunityCreated(userId: string) {
    await this.awardBadge(userId, 'creator');
    await this.checkAchievements(userId, 'xp', 0);
  }
}

export const gamificationService = new GamificationService();
