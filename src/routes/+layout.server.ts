// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { getLocalTimeZone } from "@internationalized/date";
import type { LayoutServerLoad } from "./$types";

// ============================================================================

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log(locals.locale);

	return {
		tz: getLocalTimeZone(),
		locale: locals.locale
	}
};
