import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/**/*.test.ts'],
    env: loadEnv('', process.cwd(), ''),
    onConsoleLog(_, type) {
      return type == 'stderr';
    },
  },
});
