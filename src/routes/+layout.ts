// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { setCatalog } from '@wuchale/svelte/runtime.svelte.js';
import type { LayoutLoad } from './$types';

// ============================================================================

export const load: LayoutLoad = async ({ data }) => {
	setCatalog(await import(`../locales/${data.locale}.svelte.js`));
	return { };
};
