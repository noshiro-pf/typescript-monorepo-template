import { assertExt } from 'ts-repo-utils';
import { workspaceRootPath } from '../workspace-root-path.mjs';

await assertExt({
  directories: [
    {
      path: path.resolve(workspaceRootPath, './src'),
      extension: '.mts',
      ignorePatterns: ['globals.d.mts'],
    },
    {
      path: path.resolve(workspaceRootPath, './scripts'),
      extension: '.mts',
      ignorePatterns: [],
    },
  ],
});
