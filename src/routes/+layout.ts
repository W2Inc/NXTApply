// src/routes/+layout.js
import { setCatalog } from '@wuchale/svelte/runtime.svelte.js';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	setCatalog(await import(`../locales/${data.locale}.svelte.js`));
	return { };
};
