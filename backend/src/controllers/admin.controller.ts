import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { asyncHandler } from '../utils/asyncHandler';

export class AdminController {
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getStats();
    res.json(stats);
  });

  getUserGrowth = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const data = await adminService.getUserGrowth(days);
    res.json({ data });
  });

  getPostActivity = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const data = await adminService.getPostActivity(days);
    res.json({ data });
  });
}

export const adminController = new AdminController();
