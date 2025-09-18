import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { wuchale } from '@wuchale/vite-plugin';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson(), wuchale()],
	server: {
		proxy: {}, // See: https://github.com/oven-sh/bun/issues/14825#issuecomment-3255988114
		https: {
			key: fs.readFileSync('.cert/key.pem'),
			cert: fs.readFileSync('.cert/cert.pem')
		}
	}
});
