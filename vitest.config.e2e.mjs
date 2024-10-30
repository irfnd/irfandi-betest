import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: { include: ['**/*.e2e-spec.ts'], globals: true, environment: 'node', reporters: ['verbose'] },
	plugins: [tsconfigPaths()],
});
