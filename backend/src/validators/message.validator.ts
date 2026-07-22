import { z } from 'zod';

export const createConversationSchema = z.object({
  participantId: z.string(),
  initialMessage: z.string().min(1).max(2000).optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1).max(2000).optional(),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'GIF']).default('TEXT'),
  media: z.string().optional(),
});

export const markReadSchema = z.object({
  conversationId: z.string(),
});
