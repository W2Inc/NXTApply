import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
// import Sonda from 'sonda/sveltekit';
import { defineConfig } from 'vite';
import { wuchale } from 'wuchale';

export default defineConfig({
	build: {
    sourcemap: true
  },
	plugins: [tailwindcss(),  wuchale(), sveltekit() ]
});
