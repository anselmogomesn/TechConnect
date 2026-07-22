import prisma from '../config/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { CreatePostInput, UpdatePostInput } from '../validators/post.validator';
import { logger } from '../utils/logger';
import { gamificationService } from './gamification.service';

export class PostService {
  async create(userId: string, input: CreatePostInput) {
    const post = await prisma.post.create({
      data: {
        userId,
        content: input.content,
        type: input.type,
        media: input.media || null,
        isPublic: input.isPublic,
        isDraft: input.isDraft,
        publishedAt: input.isDraft ? null : new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatar: true, level: true },
        },
      },
    });

    // Award XP + Gamification triggers
    const xpAmount = input.type === 'TEXT' ? 10 : 15;
    await gamificationService.awardXp(userId, xpAmount, `Criou postagem (${input.type})`, 'Post', post.id);
    await gamificationService.onPostCreated(userId);

    // Update user post count
    await prisma.user.update({
      where: { id: userId },
      data: { postsCount: { increment: 1 } },
    });

    logger.info(`Post created: ${post.id} by user ${userId}`);
    return post;
  }

  async findById(id: string, currentUserId?: string) {
    const post = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
        ...(currentUserId ? {} : { isPublic: true }),
      },
      include: {
        user: {
          select: { id: true, name: true, surname: true, username: true, avatar: true, level: true, title: true },
        },
        reactions: {
          select: { id: true, userId: true, type: true },
        },
        _count: { select: { comments: true, reactions: true } },
      },
    });

    if (!post) throw new NotFoundError('Post not found');
    return post;
  }

  async getFeed(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { deletedAt: null, isPublic: true, isDraft: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, surname: true, username: true, avatar: true, level: true },
          },
          reactions: {
            select: { id: true, userId: true, type: true },
            take: 10,
          },
          _count: { select: { comments: true, reactions: true } },
        },
      }),
      prisma.post.count({ where: { deletedAt: null, isPublic: true, isDraft: false } }),
    ]);

    return {
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getByUser(username: string, page: number = 1, limit: number = 20) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundError('User not found');

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { userId: user.id, deletedAt: null, isDraft: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          reactions: { select: { id: true, userId: true, type: true } },
          _count: { select: { comments: true, reactions: true } },
        },
      }),
      prisma.post.count({ where: { userId: user.id, deletedAt: null, isDraft: false } }),
    ]);

    return {
      data: posts,
      user: { id: user.id, name: user.name, username: user.username, avatar: user.avatar },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(postId: string, userId: string, input: UpdatePostInput) {
    const post = await prisma.post.findFirst({ where: { id: postId, deletedAt: null } });
    if (!post) throw new NotFoundError('Post not found');
    if (post.userId !== userId) throw new ForbiddenError('Cannot edit this post');

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        ...input,
        isEdited: true,
        editCount: { increment: 1 },
        lastEditedAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatar: true, level: true },
        },
      },
    });

    return updated;
  }

  async delete(postId: string, userId: string, userRole: string) {
    const post = await prisma.post.findFirst({ where: { id: postId, deletedAt: null } });
    if (!post) throw new NotFoundError('Post not found');
    if (post.userId !== userId && !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(userRole)) {
      throw new ForbiddenError('Cannot delete this post');
    }

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    await prisma.user.update({
      where: { id: post.userId },
      data: { postsCount: { decrement: 1 } },
    });

    logger.info(`Post deleted: ${postId} by user ${userId}`);
  }

  async toggleLike(postId: string, userId: string) {
    const post = await prisma.post.findFirst({ where: { id: postId, deletedAt: null } });
    if (!post) throw new NotFoundError('Post not found');

    const existing = await prisma.reaction.findUnique({
      where: { userId_postId_type: { userId, postId, type: 'LIKE' } },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      await prisma.post.update({ where: { id: postId }, data: { likesCount: { decrement: 1 } } });
      await prisma.user.update({ where: { id: post.userId }, data: { likesReceived: { decrement: 1 } } });
      return { liked: false };
    }

    await prisma.reaction.create({ data: { userId, postId, type: 'LIKE' } });
    await prisma.post.update({ where: { id: postId }, data: { likesCount: { increment: 1 } } });
    await prisma.user.update({ where: { id: post.userId }, data: { likesReceived: { increment: 1 } } });

    // Award XP + Gamification triggers
    await gamificationService.awardXp(post.userId, 2, 'Recebeu curtida', 'Post', postId);
    await gamificationService.onLikeReceived(post.userId);

    return { liked: true };
  }

  async getComments(postId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId, parentId: null, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, username: true, avatar: true, level: true } },
          replies: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: {
              user: { select: { id: true, name: true, username: true, avatar: true, level: true } },
            },
          },
          _count: { select: { replies: true } },
        },
      }),
      prisma.comment.count({ where: { postId, parentId: null, deletedAt: null } }),
    ]);

    return { data: comments, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createComment(postId: string, userId: string, content: string, parentId?: string) {
    const post = await prisma.post.findFirst({ where: { id: postId, deletedAt: null } });
    if (!post) throw new NotFoundError('Post not found');

    if (parentId) {
      const parent = await prisma.comment.findFirst({ where: { id: parentId, deletedAt: null } });
      if (!parent) throw new NotFoundError('Parent comment not found');
      await prisma.comment.update({ where: { id: parentId }, data: { repliesCount: { increment: 1 } } });
    }

    const comment = await prisma.comment.create({
      data: { postId, userId, content, parentId },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true, level: true } },
      },
    });

    await prisma.post.update({ where: { id: postId }, data: { commentsCount: { increment: 1 } } });
    await prisma.user.update({ where: { id: userId }, data: { commentsCount: { increment: 1 } } });

    // Award XP + Gamification triggers
    await gamificationService.awardXp(userId, 5, 'Comentou em postagem', 'Comment', comment.id);
    await gamificationService.onCommentCreated(userId);
    if (post.userId !== userId) {
      await gamificationService.awardXp(post.userId, 3, 'Recebeu comentário', 'Post', postId);
    }

    return comment;
  }

}

export const postService = new PostService();
