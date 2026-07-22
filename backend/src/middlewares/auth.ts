// ============================================
// ANSELMO - Authentication Middleware
// ============================================

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import prisma from '../config/prisma';
import { asyncHandler } from '../utils/asyncHandler';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: string;
      userRole?: string;
    }
  }
}

export const authenticate = asyncHandler(
  async (req, _res: Response, next: NextFunction) => {
    // 1. Try cookie first (Refresh token strategy)
    // 2. Then Authorization header

    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Check cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      // Verify session still exists and is not revoked
      const session = await prisma.session.findUnique({
        where: { id: decoded.sessionId },
        select: { isRevoked: true, expiresAt: true, userId: true },
      });

      if (!session || session.isRevoked) {
        throw new UnauthorizedError('Session revoked');
      }

      if (new Date() > session.expiresAt) {
        throw new UnauthorizedError('Session expired');
      }

      // Verify user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, status: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      if (user.status === 'BANNED') {
        throw new ForbiddenError('Account is banned');
      }

      if (user.status === 'SILENCED') {
        // Allow reading but not writing - handled in content creation
      }

      if (user.status === 'DELETED') {
        throw new UnauthorizedError('Account deleted');
      }

      req.user = decoded;
      req.userId = decoded.userId;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        throw error;
      }
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
);

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !req.userRole) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!roles.includes(req.userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};

// Optional auth (doesn't throw if no token)
export const optionalAuth = asyncHandler(
  async (req, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = decoded;
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } catch {
      // Silently fail - auth is optional
    }

    next();
  }
);
