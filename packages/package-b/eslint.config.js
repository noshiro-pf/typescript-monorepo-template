import tseslint from 'typescript-eslint';
import { sharedConfig } from '../../configs/eslint/shared-config.mjs';

export default tseslint.config(...sharedConfig);
