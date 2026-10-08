import path from 'node:path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      // `server-only` throws outside a React Server environment; in unit tests it is a no-op.
      'server-only': path.resolve(import.meta.dirname, 'tests/stubs/server-only.ts')
    }
  },
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/db/**/*.test.ts'],
    testTimeout: 30000
  }
});
