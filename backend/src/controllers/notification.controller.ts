import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { asyncHandler } from '../utils/asyncHandler';

export class NotificationController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await notificationService.getUserNotifications(req.userId!, page);
    res.json(result);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAsRead(req.params.id, req.userId!);
    res.json({ message: 'Marked as read' });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.userId!);
    res.json({ message: 'All marked as read' });
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await notificationService.getUnreadCount(req.userId!);
    res.json({ unreadCount: count });
  });
}

export const notificationController = new NotificationController();
