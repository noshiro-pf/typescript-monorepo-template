import * as path from 'node:path';
import { defineConfig } from 'vitest/config';
import { workspaceRootPath } from '../scripts/workspace-root-path.mjs';

// https://github.com/vitest-dev/vitest/blob/v1.5.0/test/import-meta/vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    dir: path.resolve(workspaceRootPath, './src'),
    includeSource: ['src/**/*.mts'],
    typecheck: {
      tsconfig: path.resolve(workspaceRootPath, './configs/tsconfig.test.json'),
    },
    passWithNoTests: true,
    restoreMocks: true,
    hideSkippedTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text'],
      include: ['src/**'],
      exclude: ['**/index.mts'],
    },
  },
});
