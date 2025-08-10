// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { LayoutLoad } from './$types'
import { loadCatalogs } from 'wuchale/run-client'
import { loadIDs, loadCatalog } from '../locales/client/loader.svelte.js'
import { error } from '@sveltejs/kit';

// ============================================================================

export const load: LayoutLoad = async ({ data }) => {
	return {
		catalogs: await loadCatalogs(data.locale, loadIDs, loadCatalog)
	};
};
