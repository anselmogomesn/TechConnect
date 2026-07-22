import { describe, it, expect, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { postService } from '../../src/services/post.service';

const prisma = new PrismaClient();

describe('PostService', () => {
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: `test-post-${Date.now()}@test.com`,
        password: await bcrypt.hash('Test@1234', 10),
        name: 'Post',
        surname: 'Tester',
        username: `post-tester-${Date.now()}`,
      },
    });
    userId = user.id;
  });

  describe('create', () => {
    it('should create a text post', async () => {
      const post = await postService.create(userId, {
        content: 'Test post content',
        type: 'TEXT',
        isPublic: true,
        isDraft: false,
      });

      expect(post).toBeDefined();
      expect(post.content).toBe('Test post content');
      expect(post.type).toBe('TEXT');
      expect(post.userId).toBe(userId);
    });

    it('should increment user post count', async () => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      expect(user!.postsCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getFeed', () => {
    it('should return paginated feed', async () => {
      const result = await postService.getFeed(1, 10);
      expect(result.data).toBeDefined();
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
    });
  });

  describe('toggleLike', () => {
    it('should like a post', async () => {
      const posts = await postService.getFeed(1, 1);
      if (posts.data.length > 0) {
        const result = await postService.toggleLike(posts.data[0].id, userId);
        expect(result.liked).toBe(true);
      }
    });
  });
});
