// @ts-check
import { defineConfig } from 'wuchale';
import { adapter as svelte } from '@wuchale/svelte';
import { adapter as vanilla } from 'wuchale/adapter-vanilla';

export default defineConfig({
	locales: {
		// English included by default
		es: { name: 'Español' },
		fr: { name: 'Francais' }
	},
	adapters: {
		single: svelte({
			files: ['./src/routes/**/*.svelte', './src/routes/**/*.svelte.{js,ts}'],
			catalog: './src/locales/client/{locale}'
		}),
		// server: vanilla({
		// 	files: './src/**/*.server.{js,ts}',
		// 	catalog: './src/locales/server/{locale}',
		// 	writeFiles: {
		// 		compiled: true,
		// 		proxy: true
		// 	},
		// 	initInsideFunc: true
		// })
	}
});
