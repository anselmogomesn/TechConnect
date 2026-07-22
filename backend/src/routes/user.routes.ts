import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { uploadAvatar, uploadBanner } from '../middlewares/upload';
import { uploadLimiter } from '../security/rateLimiter';
import { z } from 'zod';

const router = Router();

// Public routes
// GET /api/users/:username - Get user profile
router.get('/:username', userController.getProfile);

// GET /api/users/:username/followers
router.get('/:username/followers', userController.getFollowers);

// GET /api/users/:username/following
router.get('/:username/following', userController.getFollowing);

// Protected routes
router.use(authenticate);

// PUT /api/users/profile - Update profile
router.put(
  '/profile',
  validate(
    z.object({
      name: z.string().min(2).max(50).optional(),
      surname: z.string().min(2).max(50).optional(),
      bio: z.string().max(500).optional().nullable(),
      website: z.string().max(200).optional().nullable(),
      location: z.string().max(100).optional().nullable(),
      birthDate: z.string().optional().nullable(),
    })
  ),
  userController.updateProfile
);

// PUT /api/users/username - Update username
router.put(
  '/username',
  validate(z.object({ username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/) })),
  userController.updateUsername
);

// PUT /api/users/password - Change password
router.put(
  '/password',
  validate(
    z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    })
  ),
  userController.changePassword
);

// POST /api/users/avatar - Upload avatar
router.post('/avatar', uploadLimiter, uploadAvatar.single('avatar'), userController.uploadAvatar);

// POST /api/users/banner - Upload banner
router.post('/banner', uploadLimiter, uploadBanner.single('banner'), userController.uploadBanner);

// GET /api/users/sessions - Get active sessions
router.get('/sessions/list', userController.getSessions);

// DELETE /api/users/sessions/:sessionId - Revoke session
router.delete('/sessions/:sessionId', userController.revokeSession);

// 2FA routes
router.post('/2fa/setup', userController.setup2FA);
router.post('/2fa/enable', validate(z.object({ token: z.string().length(6) })), userController.enable2FA);
router.post('/2fa/disable', validate(z.object({ password: z.string().min(1) })), userController.disable2FA);

// POST /api/users/:username/follow - Toggle follow
router.post('/:username/follow', userController.toggleFollow);

export default router;
