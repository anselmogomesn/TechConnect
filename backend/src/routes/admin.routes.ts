import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth';
import prisma from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/users/growth', adminController.getUserGrowth);
router.get('/activity/posts', adminController.getPostActivity);

// Reports management
router.get('/reports', asyncHandler(async (req, res) => {
  const status = (req.query.status as string) || 'PENDING';
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const [data, total] = await Promise.all([
    prisma.report.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reporter: { select: { id: true, name: true, username: true, avatar: true } },
        handler: { select: { id: true, name: true, username: true } },
      },
    }),
    prisma.report.count({ where: { status } }),
  ]);
  res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}));

router.put('/reports/:id', asyncHandler(async (req, res) => {
  const { status, resolution } = req.body;
  await prisma.report.update({
    where: { id: req.params.id },
    data: { status, handledBy: req.userId, handledAt: new Date(), resolution },
  });
  res.json({ message: 'Report updated' });
}));

// User management
router.put('/users/:id/ban', asyncHandler(async (req, res) => {
  await prisma.user.update({ where: { id: req.params.id }, data: { status: 'BANNED' } });
  res.json({ message: 'User banned' });
}));

router.put('/users/:id/unban', asyncHandler(async (req, res) => {
  await prisma.user.update({ where: { id: req.params.id }, data: { status: 'ACTIVE' } });
  res.json({ message: 'User unbanned' });
}));

router.put('/users/:id/silence', asyncHandler(async (req, res) => {
  await prisma.user.update({ where: { id: req.params.id }, data: { status: 'SILENCED' } });
  res.json({ message: 'User silenced' } );
}));

// Badge management
router.post('/badges', asyncHandler(async (req, res) => {
  const badge = await prisma.badge.create({ data: req.body });
  res.status(201).json({ badge });
}));

router.put('/badges/:id', asyncHandler(async (req, res) => {
  const badge = await prisma.badge.update({ where: { id: req.params.id }, data: req.body });
  res.json({ badge });
}));

export default router;
