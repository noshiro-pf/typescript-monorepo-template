import * as path from 'node:path';
import { type UserConfig } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Returns
 * ```ts
 * {
 *    test: {
 *      globals: true,
 *      environment: 'happy-dom',
 *      typecheck: {
 *        tsconfig: path.resolve(configDir, 'tsconfig.test.json'),
 *      },
 *      passWithNoTests: true,
 *      coverage: {
 *        reportsDirectory: 'coverage/lcov-report',
 *        reporter: ['lcov'],
 *      },
 *    },
 * }
 * ```
 * Assumes config dir is in <project-root>/configs.
 */
export const defineViteConfig = (configDir: string): UserConfig =>
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      typecheck: {
        tsconfig: path.resolve(configDir, 'tsconfig.test.json'),
      },
      passWithNoTests: true,
      coverage: {
        reportsDirectory: 'coverage/lcov-report',
        reporter: ['lcov'],
      },
    },
  });
