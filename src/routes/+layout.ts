import { locales } from 'virtual:wuchale/locales';
import { browser } from '$app/environment';
import { loadLocale } from 'wuchale/load-utils';
import '../locales/loader.svelte.js';
import type { LayoutLoad } from './$types.js';

export const load: LayoutLoad = async ({ url, data }) => {
	const locale = url.searchParams.get('locale') ?? 'en';
	if (!locales.includes(locale)) {
		return;
	}
	if (browser) {
		await loadLocale(locale);
	}
};
