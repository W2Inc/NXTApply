// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { LayoutServerLoad } from "./$types";

// ============================================================================

export const load: LayoutServerLoad = async ({ cookies }) => {
	return {
		locale: cookies.get("lang"),
	}
};
