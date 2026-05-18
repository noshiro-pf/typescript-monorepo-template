import * as path from 'node:path';
import { workspaceRootPath } from '../scripts/workspace-root-path.mjs';
// eslint-disable-next-line import-x/no-relative-packages
import { defineViteConfig } from '../../../configs/vite-config.mjs';

export default defineViteConfig({
  workspaceRootPath,
  alias: {
    '@noshiro-pf/package-a': path.resolve(workspaceRootPath, './src/index.mts'),
  },
});
