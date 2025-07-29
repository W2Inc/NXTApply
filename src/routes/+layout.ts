// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { LayoutLoad } from './$types'
import { locales } from 'virtual:wuchale/locales'
import { loadCatalogs } from 'wuchale/run-client'
import { loadIDs, loadCatalog } from '../locales/client/loader.svelte.js'

// ============================================================================

export const load: LayoutLoad = async ({ data }) => {
	// if (!(locale in locales)) {
	// 	return;
	// }
	return {
		locale: data.locale,
		tz: data.tz,
		catalogs: await loadCatalogs(data.locale, loadIDs, loadCatalog)
	};
};
