import { z } from 'zod';

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post cannot be empty')
    .max(5000, 'Post must be at most 5000 characters'),
  type: z
    .enum(['TEXT', 'IMAGE', 'VIDEO', 'CODE', 'POLL', 'LINK'])
    .default('TEXT'),
  media: z.string().optional(),
  isPublic: z.boolean().default(true),
  isDraft: z.boolean().default(false),
  scheduledAt: z.string().datetime().optional(),
});

export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post cannot be empty')
    .max(5000, 'Post must be at most 5000 characters')
    .optional(),
  isPublic: z.boolean().optional(),
  isDraft: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be at most 2000 characters'),
  parentId: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
