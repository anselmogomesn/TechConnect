import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/*.types.ts'],
      thresholds: {
        branches: 60,
        functions: 60,
        lines: 70,
        statements: 70,
      },
    },
    setupFiles: ['./tests/setup.ts'],
  },
});
