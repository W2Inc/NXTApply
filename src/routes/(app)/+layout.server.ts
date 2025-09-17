// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { LayoutServerLoad } from "./$types";
import { getUser } from "@/remotes/user/get.remote";
import { error } from "@sveltejs/kit";

// ============================================================================

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: await getUser(locals.session.userId) ?? error(401)
	}
};
