import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.use(authenticate);

router.get('/', notificationController.getAll);
router.get('/unread', notificationController.getUnreadCount);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);

export default router;
