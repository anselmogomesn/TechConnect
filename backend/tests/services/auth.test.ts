import { describe, it, expect, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authService } from '../../src/services/auth.service';

const prisma = new PrismaClient();

describe('AuthService', () => {
  beforeAll(async () => {
    // Clean database
    await prisma.user.deleteMany({ where: { email: { contains: 'test-' } } });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const result = await authService.register({
        email: 'test-user@test.com',
        password: 'Test@1234',
        name: 'Test',
        surname: 'User',
        username: `test-user-${Date.now()}`,
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test-user@test.com');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await expect(
        authService.register({
          email: 'test-user@test.com',
          password: 'Test@1234',
          name: 'Test',
          surname: 'User',
          username: `test-user-2-${Date.now()}`,
        })
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const result = await authService.login(
        { email: 'test-user@test.com', password: 'Test@1234' },
        '127.0.0.1',
        'test-agent'
      );

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      await expect(
        authService.login(
          { email: 'test-user@test.com', password: 'WrongPassword@123' },
          '127.0.0.1'
        )
      ).rejects.toThrow();
    });
  });
});
