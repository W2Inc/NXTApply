// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { LayoutServerLoad } from './$types';
import { getEventsForUser } from './app.remote';

// ============================================================================

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		tz: locals.tz,
		locale: locals.locale,
		events: await getEventsForUser()
	};
};
