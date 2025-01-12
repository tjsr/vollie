import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

// import tsconfigPaths from 'vite-tsconfig-paths';

export default defineWorkersConfig({
	test: {
		globals: true,
		include: ['src/**/*.test.ts'],
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
	},
	// },
	// plugins: [
	// 	tsconfigPaths({
	// 		projects: ['./tsconfig.vitest.json']
	// 	})
	// ]
});
