import { Router } from 'express';
import { communityController } from '../controllers/community.controller';
import { authenticate, optionalAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { z } from 'zod';

const router = Router();

// Public
router.get('/', communityController.getAll);
router.get('/:slug', optionalAuth, communityController.getBySlug);
router.get('/:slug/members', communityController.getMembers);

// Protected
router.post('/', authenticate, validate(
  z.object({ name: z.string().min(3).max(50), description: z.string().max(500).optional(), category: z.string().max(50).optional() })
), communityController.create);

router.post('/:slug/join', authenticate, communityController.join);
router.post('/:slug/leave', authenticate, communityController.leave);

// Community feed
router.get('/:slug/posts', communityController.getPosts);

// Admin/Owner
router.put('/:slug', authenticate, communityController.update);
router.delete('/:slug/members/:userId', authenticate, communityController.removeMember);
router.put('/:slug/members/:userId/role', authenticate, communityController.updateMemberRole);

export default router;
