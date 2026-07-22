// ============================================
// ANSELMO - Rate Limiters Especializados
// ============================================

import rateLimit from 'express-rate-limit';
import config from '../config';

// Rate limiter para rotas de autenticação
export const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Too many login attempts. Please try again later.',
    },
  },
});

// Rate limiter para criação de posts (anti-spam)
export const postLimiter = rateLimit({
  windowMs: 60000, // 1 minuto
  max: 10, // 10 posts por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_POST',
      message: 'Too many posts. Please slow down.',
    },
  },
});

// Rate limiter para comentários
export const commentLimiter = rateLimit({
  windowMs: 60000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_COMMENT',
      message: 'Too many comments. Please slow down.',
    },
  },
});

// Rate limiter para uploads
export const uploadLimiter = rateLimit({
  windowMs: 60000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_UPLOAD',
      message: 'Too many uploads. Please slow down.',
    },
  },
});

// Rate limiter para API geral
export const apiLimiter = rateLimit({
  windowMs: 60000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_API',
      message: 'Too many requests. Please slow down.',
    },
  },
});
