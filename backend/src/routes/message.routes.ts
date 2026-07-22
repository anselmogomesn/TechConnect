import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createConversationSchema, sendMessageSchema, markReadSchema } from '../validators/message.validator';

const router = Router();
router.use(authenticate);

router.get('/conversations', messageController.getConversations);
router.post('/conversations', validate(createConversationSchema), messageController.getOrCreateConversation);
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/messages', validate(sendMessageSchema), messageController.sendMessage);
router.post('/read', validate(markReadSchema), messageController.markAsRead);
router.get('/unread', messageController.getUnreadCount);

export default router;
