import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import prisma from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);

router.get('/badges', asyncHandler(async (_req, res) => {
  const data = await prisma.badge.findMany({ orderBy: [{ rarity: 'asc' }, { order: 'asc' }] });
  res.json({ data });
}));

router.get('/badges/user', asyncHandler(async (req, res) => {
  const data = await prisma.userBadge.findMany({
    where: { userId: req.userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });
  res.json({ data: data.map((ub) => ({ ...ub.badge, earnedAt: ub.earnedAt })) });
}));

router.get('/achievements', asyncHandler(async (_req, res) => {
  const data = await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
  res.json({ data });
}));

router.get('/achievements/user', asyncHandler(async (req, res) => {
  const data = await prisma.userAchievement.findMany({
    where: { userId: req.userId },
    include: { achievement: true },
    orderBy: [{ completed: 'desc' }, { progress: 'desc' }],
  });
  res.json({ data: data.map((ua) => ({ ...ua.achievement, progress: ua.progress, completed: ua.completed, completedAt: ua.completedAt })) });
}));

router.get('/missions', asyncHandler(async (_req, res) => {
  const data = await prisma.mission.findMany({
    where: { isActive: true },
    orderBy: [{ type: 'asc' }, { order: 'asc' }],
  });
  res.json({ data });
}));

router.get('/missions/user', asyncHandler(async (req, res) => {
  const data = await prisma.userMission.findMany({
    where: { userId: req.userId },
    include: { mission: true },
    orderBy: [{ completed: 'asc' }, { updatedAt: 'desc' }],
  });
  res.json({ data: data.map((um) => ({ ...um.mission, progress: um.progress, completed: um.completed, claimed: um.claimed })) });
}));

export default router;
