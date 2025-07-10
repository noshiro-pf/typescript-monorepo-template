import { genIndex } from 'ts-repo-utils';
import { workspaceRootPath } from '../workspace-root-path.mjs';

try {
  await genIndex({
    targetDirectory: path.resolve(workspaceRootPath, './src'),
  });
} catch (error) {
  console.error(`Error: ${String(error)}`);
  process.exit(1);
}
