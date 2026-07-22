// ============================================
// ANSELMO - Socket.IO Initialization
// ============================================

import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';
import { logger } from '../utils/logger';
import prisma from '../config/prisma';

let io: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    maxHttpBufferSize: 1e6, // 1MB max message size
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as any;

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, status: true },
      });

      if (!user || user.status === 'BANNED' || user.status === 'DELETED') {
        return next(new Error('Invalid user'));
      }

      socket.data.userId = decoded.userId;
      socket.data.sessionId = decoded.sessionId;
      socket.join(`user:${decoded.userId}`);

      // Update user status to online
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { lastActivity: new Date() },
      });

      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    logger.debug(`Socket connected: user ${userId}`);

    // Join user's room for private messages
    socket.join(`user:${userId}`);

    // Track online status
    socket.broadcast.emit('user:online', { userId });

    // Handle typing events
    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', {
        userId,
        conversationId,
      });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', {
        userId,
        conversationId,
      });
    });

    // Handle join conversation
    socket.on('conversation:join', ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      logger.debug(`Socket disconnected: user ${userId}`);
      socket.broadcast.emit('user:offline', { userId });

      await prisma.user.update({
        where: { id: userId },
        data: { lastActivity: new Date() },
      });
    });
  });

  logger.info('Socket.IO initialized');
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

// Helper to send notification to specific user
export function sendNotification(
  userId: string,
  notification: {
    type: string;
    title: string;
    message?: string;
    referenceId?: string;
    image?: string;
    link?: string;
  }
) {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
}

// Helper to send message event
export function sendMessageEvent(
  conversationId: string,
  event: string,
  data: any
) {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
  }
}
