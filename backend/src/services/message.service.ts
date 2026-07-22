import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';
import { getIO } from '../socket';

export class MessageService {
  async getConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, username: true, avatar: true, level: true, status: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true, username: true, avatar: true } },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return conversations.map((c) => {
      const otherParticipants = c.participants.filter((p) => p.userId !== userId);
      return {
        id: c.id,
        isGroup: c.isGroup,
        name: c.isGroup ? c.name : otherParticipants[0]?.user.name,
        avatar: c.isGroup ? c.avatar : otherParticipants[0]?.user.avatar,
        lastMessage: c.messages[0] || null,
        lastMessageAt: c.lastMessageAt,
        participants: c.participants.map((p) => ({
          userId: p.userId,
          name: p.user.name,
          username: p.user.username,
          avatar: p.user.avatar,
          level: p.user.level,
          status: p.user.status,
          lastReadAt: p.lastReadAt,
          isMuted: p.isMuted,
        })),
        unreadCount: 0, // Will be calculated
      };
    });
  }

  async getOrCreateConversation(userId: string, participantId: string, initialMessage?: string) {
    // Check if conversation already exists between these two users
    const existing = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: participantId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true, level: true, status: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { id: true, name: true, username: true, avatar: true } } },
        },
      },
    });

    if (existing) return existing;

    // Check participant exists
    const participant = await prisma.user.findUnique({
      where: { id: participantId },
      select: { id: true },
    });
    if (!participant) throw new NotFoundError('User not found');

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: participantId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, username: true, avatar: true, level: true, status: true } },
          },
        },
      },
    });

    // If initial message, send it
    if (initialMessage) {
      const message = await this.sendMessage(userId, conversation.id, initialMessage);
      return { ...conversation, messages: [message], lastMessage: message };
    }

    return { ...conversation, messages: [], lastMessage: null };
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    // Verify user is participant
    const participant = await prisma.userConversation.findUnique({
      where: { userId_conversationId: { userId, conversationId } },
    });
    if (!participant) throw new ForbiddenError('Not a participant');

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          sender: { select: { id: true, name: true, username: true, avatar: true } },
        },
      }),
      prisma.message.count({ where: { conversationId, isDeleted: false } }),
    ]);

    // Mark messages as read
    await prisma.userConversation.update({
      where: { userId_conversationId: { userId, conversationId } },
      data: { lastReadAt: new Date() },
    });

    return {
      data: messages.reverse(),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async sendMessage(senderId: string, conversationId: string, content: string, type = 'TEXT', media?: string) {
    // Verify sender is participant
    const participant = await prisma.userConversation.findUnique({
      where: { userId_conversationId: { userId: senderId, conversationId } },
    });
    if (!participant) throw new ForbiddenError('Not a participant');

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        type,
        media,
        isDelivered: true,
        deliveredAt: new Date(),
      },
      include: {
        sender: { select: { id: true, name: true, username: true, avatar: true } },
      },
    });

    // Update conversation's last message timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Emit via Socket.IO to all participants
    const io = getIO();
    io.to(`conversation:${conversationId}`).emit('message:new', message);

    // Notify other participants
    const participants = await prisma.userConversation.findMany({
      where: { conversationId, userId: { not: senderId } },
      select: { userId: true },
    });
    participants.forEach((p) => {
      io.to(`user:${p.userId}`).emit('notification', {
        type: 'MESSAGE',
        title: 'Nova mensagem',
        message: content?.substring(0, 100),
        referenceId: conversationId,
        referenceType: 'conversation',
      });
    });

    return message;
  }

  async markAsRead(userId: string, conversationId: string) {
    await prisma.userConversation.update({
      where: { userId_conversationId: { userId, conversationId } },
      data: { lastReadAt: new Date() },
    });

    const io = getIO();
    io.to(`conversation:${conversationId}`).emit('message:read', {
      userId,
      conversationId,
      readAt: new Date(),
    });
  }

  async getUnreadCount(userId: string) {
    const conversations = await prisma.userConversation.findMany({
      where: { userId },
      select: { conversationId: true, lastReadAt: true },
    });

    let total = 0;
    for (const conv of conversations) {
      const count = await prisma.message.count({
        where: {
          conversationId: conv.conversationId,
          senderId: { not: userId },
          createdAt: { gt: conv.lastReadAt || new Date(0) },
          isDeleted: false,
        },
      });
      total += count;
    }

    return total;
  }
}

export const messageService = new MessageService();
