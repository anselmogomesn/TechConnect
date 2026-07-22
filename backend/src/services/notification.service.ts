import prisma from '../config/prisma';
import { getIO } from '../socket';

export class NotificationService {
  async create(data: {
    userId: string;
    type: string;
    title: string;
    message?: string;
    referenceId?: string;
    referenceType?: string;
    actorId?: string;
    image?: string;
    link?: string;
  }) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        referenceId: data.referenceId,
        referenceType: data.referenceType,
        actorId: data.actorId,
        image: data.image,
        link: data.link,
      },
    });

    // Emit via Socket.IO
    const io = getIO();
    io.to(`user:${data.userId}`).emit('notification', {
      ...notification,
      actor: data.actorId ? { id: data.actorId } : undefined,
    });

    return notification;
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: false,
        },
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      data: notifications,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }

  // Helper to create notification for post interactions
  async notifyLike(postId: string, actorId: string, targetUserId: string) {
    if (actorId === targetUserId) return;
    await this.create({
      userId: targetUserId,
      type: 'LIKE',
      title: 'Nova curtida',
      message: 'Alguém curtiu sua postagem',
      referenceId: postId,
      referenceType: 'post',
      actorId,
    });
  }

  async notifyComment(postId: string, actorId: string, targetUserId: string) {
    if (actorId === targetUserId) return;
    await this.create({
      userId: targetUserId,
      type: 'COMMENT',
      title: 'Novo comentário',
      message: 'Alguém comentou na sua postagem',
      referenceId: postId,
      referenceType: 'post',
      actorId,
    });
  }

  async notifyFollow(actorId: string, targetUserId: string) {
    if (actorId === targetUserId) return;
    await this.create({
      userId: targetUserId,
      type: 'FOLLOW',
      title: 'Novo seguidor',
      message: 'Alguém começou a seguir você',
      referenceType: 'user',
      actorId,
      link: `/user/${actorId}`,
    });
  }
}

export const notificationService = new NotificationService();
