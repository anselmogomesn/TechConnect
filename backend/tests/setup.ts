import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  process.env.DATABASE_URL = 'file:./test.db';
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
});

afterAll(async () => {
  // Cleanup
});
