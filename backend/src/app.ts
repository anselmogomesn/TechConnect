// ============================================
// ANSELMO - Express Application Setup
// ============================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import config from './config';
import { logger, LoggerStream } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';

// Rotas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import messageRoutes from './routes/message.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import communityRoutes from './routes/community.routes';
import collectionsRoutes from './routes/collections.routes';
import searchRoutes from './routes/search.routes';
import gameRoutes from './routes/game.routes';
import socialRoutes from './routes/social.routes';

const app = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: config.server.isDev ? false : undefined,
}));

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['Set-Cookie'],
}));

// Cookie parser
app.use(cookieParser(config.cookie.secret));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP Logger
app.use(morgan('short', {
  stream: new LoggerStream(),
  skip: () => config.server.nodeEnv === 'test',
}));

// Rate limit global
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later',
    },
  },
});

app.use(globalLimiter);

// ============================================
// STATIC FILES (Uploads)
// ============================================

app.use('/uploads', express.static(config.upload.dir));

// ============================================
// ROTAS
// ============================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api', collectionsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', gameRoutes);
app.use('/api', socialRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// ============================================
// ERROR HANDLER (deve ser o último)
// ============================================

app.use(errorHandler);

export default app;
