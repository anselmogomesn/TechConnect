// ============================================
// ANSELMO - Auth Routes
// ============================================

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { authLimiter } from '../security/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';

const router = Router();

// Apply rate limiter to all auth routes
router.use(authLimiter);

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /api/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me
router.get('/me', authenticate, authController.me);

export default router;
