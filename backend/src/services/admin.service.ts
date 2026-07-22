import prisma from '../config/prisma';

export class AdminService {
  async getStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers, newUsersToday, usersActiveWeek, usersByRole,
      totalPosts, postsToday, totalComments, totalReactions,
      totalCommunities, totalMessages, totalXpDistributed,
      levelDistribution, usersByStatus,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { lastActivity: { gte: weekAgo }, deletedAt: null } }),
      prisma.user.groupBy({ by: ['role'], _count: true }),
      prisma.post.count({ where: { deletedAt: null, isDraft: false } }),
      prisma.post.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.comment.count({ where: { deletedAt: null } }),
      prisma.reaction.count(),
      prisma.community.count({ where: { deletedAt: null } }),
      prisma.message.count(),
      prisma.xpHistory.aggregate({ _sum: { amount: true } }),
      prisma.user.groupBy({ by: ['level'], _count: true, orderBy: { level: 'asc' }, take: 20 }),
      prisma.user.groupBy({ by: ['status'], _count: true }),
    ]);

    return {
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        activeWeek: usersActiveWeek,
        byRole: usersByRole,
        byStatus: usersByStatus,
      },
      content: {
        posts: totalPosts,
        postsToday,
        comments: totalComments,
        reactions: totalReactions,
      },
      community: {
        communities: totalCommunities,
        messages: totalMessages,
      },
      xp: {
        total: totalXpDistributed._sum.amount || 0,
      },
      levels: levelDistribution,
    };
  }

  async getUserGrowth(days = 30) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const count = await prisma.user.count({
        where: { createdAt: { gte: dayStart, lt: dayEnd } },
      });

      data.push({
        date: dayStart.toISOString().split('T')[0],
        count,
      });
    }
    return data;
  }

  async getPostActivity(days = 30) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const [posts, comments, reactions] = await Promise.all([
        prisma.post.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
        prisma.comment.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
        prisma.reaction.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
      ]);

      data.push({
        date: dayStart.toISOString().split('T')[0],
        posts,
        comments,
        reactions,
      });
    }
    return data;
  }
}

export const adminService = new AdminService();
