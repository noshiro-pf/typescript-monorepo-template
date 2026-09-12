import { defineConfig } from 'vitest/config';
import { projectRootPath } from '../scripts/project-root-path.mjs';

/**
 * The Vitest project for the repository-level scripts under `scripts/`.
 *
 * `scripts/` and `configs/` are plain directories, not workspace members, so
 * `ws:test` never reaches them; `check:root:test` runs this instead, which
 * puts it behind the same `type-check (check:root)` context as the rest of
 * `check:root`. It runs on the Node `volta.node` names — the one the scripts
 * themselves run on — and not across the compatibility matrix.
 */
export default defineConfig({
  test: {
    dir: projectRootPath,
    globals: true,
    environment: 'node',
    include: ['scripts/**/*.test.mts'],
    passWithNoTests: true,
  },
});
