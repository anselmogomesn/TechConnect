import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import prisma from '../config/prisma';

export class UserController {
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await userService.getProfile(req.params.username, req.userId);
    res.json({ user: profile });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.userId!, req.body);
    res.json({ message: 'Profile updated', user });
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.userId!, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  });

  uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: { code: 'NO_FILE', message: 'No file uploaded' } });
      return;
    }
    const result = await userService.updateAvatar(req.userId!, req.file.filename);
    res.json({ message: 'Avatar updated', avatar: result.avatar });
  });

  uploadBanner = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: { code: 'NO_FILE', message: 'No file uploaded' } });
      return;
    }
    const result = await userService.updateBanner(req.userId!, req.file.filename);
    res.json({ message: 'Banner updated', banner: result.banner });
  });

  updateUsername = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.updateUsername(req.userId!, req.body.username);
    res.json({ message: 'Username updated', username: result.username });
  });

  getSessions = asyncHandler(async (_req: Request, res: Response) => {
    const sessions = await userService.getSessions(req.userId!);
    res.json({ sessions });
  });

  revokeSession = asyncHandler(async (req: Request, res: Response) => {
    await userService.revokeSession(req.userId!, req.params.sessionId);
    res.json({ message: 'Session revoked' });
  });

  setup2FA = asyncHandler(async (_req: Request, res: Response) => {
    const result = await userService.setup2FA(req.userId!);
    res.json(result);
  });

  enable2FA = asyncHandler(async (req: Request, res: Response) => {
    await userService.enable2FA(req.userId!, req.body.token);
    res.json({ message: '2FA enabled successfully' });
  });

  disable2FA = asyncHandler(async (req: Request, res: Response) => {
    await userService.disable2FA(req.userId!, req.body.password);
    res.json({ message: '2FA disabled' });
  });

  toggleFollow = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.toggleFollow(req.userId!, req.params.username);
    res.json(result);
  });

  // Get followers/following lists
  getFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: user.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: {
            select: { id: true, name: true, surname: true, username: true, avatar: true, level: true, title: true },
          },
        },
      }),
      prisma.follow.count({ where: { followingId: user.id } }),
    ]);

    res.json({
      followers: followers.map((f) => f.follower),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });

  getFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    const [following, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: user.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          following: {
            select: { id: true, name: true, surname: true, username: true, avatar: true, level: true, title: true },
          },
        },
      }),
      prisma.follow.count({ where: { followerId: user.id } }),
    ]);

    res.json({
      following: following.map((f) => f.following),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}

export const userController = new UserController();
