import { Request, Response } from 'express';
import { messageService } from '../services/message.service';
import { asyncHandler } from '../utils/asyncHandler';

export class MessageController {
  getConversations = asyncHandler(async (req: Request, res: Response) => {
    const conversations = await messageService.getConversations(req.userId!);
    res.json({ conversations });
  });

  getOrCreateConversation = asyncHandler(async (req: Request, res: Response) => {
    const { participantId, initialMessage } = req.body;
    const conversation = await messageService.getOrCreateConversation(
      req.userId!, participantId, initialMessage
    );
    res.json({ conversation });
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await messageService.getMessages(
      req.params.conversationId, req.userId!, page
    );
    res.json(result);
  });

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId, content, type, media } = req.body;
    const message = await messageService.sendMessage(
      req.userId!, conversationId, content, type, media
    );
    res.status(201).json({ message: 'Message sent', data: message });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    await messageService.markAsRead(req.userId!, req.body.conversationId);
    res.json({ message: 'Marked as read' });
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await messageService.getUnreadCount(req.userId!);
    res.json({ unreadCount: count });
  });
}

export const messageController = new MessageController();
