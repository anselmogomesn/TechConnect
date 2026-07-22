// ============================================
// ANSELMO - Auth Controller
// ============================================

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import config from '../config';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    res.status(201).json({
      message: 'Account created successfully',
      user: result.user,
      accessToken: result.accessToken,
      sessionId: result.sessionId,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await authService.login(req.body, ip, userAgent);

    if (result.requiresTwoFactor) {
      res.json({ requiresTwoFactor: true, userId: result.userId });
      return;
    }

    this.setTokenCookies(res, result.accessToken!, result.refreshToken!);

    res.json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      sessionId: result.sessionId,
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Refresh token required' },
      });
      return;
    }

    const result = await authService.refreshToken(refreshToken);

    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    res.json({
      accessToken: result.accessToken,
      sessionId: result.sessionId,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const sessionId = req.user?.sessionId;

    if (userId) {
      await authService.logout(userId, sessionId);
    }

    this.clearTokenCookies(res);

    res.json({ message: 'Logged out successfully' });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma?.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        username: true,
        bio: true,
        avatar: true,
        banner: true,
        website: true,
        location: true,
        role: true,
        status: true,
        level: true,
        xp: true,
        totalXpEarned: true,
        reputation: true,
        title: true,
        followersCount: true,
        followingCount: true,
        postsCount: true,
        twoFactorEnabled: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
      return;
    }

    res.json({ user });
  });

  // ============================================
  // COOKIE HELPERS
  // ============================================
  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    const isSecure = config.server.isProd;

    // Access token cookie (short-lived)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Refresh token cookie (long-lived)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth',
    });
  }

  private clearTokenCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/api/auth' });
  }
}

// Import prisma for the me handler
import prisma from '../config/prisma';

export const authController = new AuthController();
