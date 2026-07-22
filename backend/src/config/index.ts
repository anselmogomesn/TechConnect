// ============================================
// TechConnect - Configuração Centralizada
// ============================================

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    isDev: (process.env.NODE_ENV || 'development') === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },

  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cookie: {
    secret: process.env.COOKIE_SECRET || 'fallback-cookie-secret',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  upload: {
    dir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || '../../uploads'),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
    maxImageWidth: 4096,
    maxImageHeight: 4096,
  },

  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@anselmo.com',
  },

  totp: {
    issuer: process.env.TOTP_ISSUER || 'TechConnect',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    authMax: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5', 10),
  },

  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    loginBlockDurationMinutes: parseInt(process.env.LOGIN_BLOCK_DURATION_MINUTES || '15', 10),
  },
} as const;

export default config;
