// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { getLocalTimeZone } from "@internationalized/date";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";
import type { User } from "@prisma/client";
import { error } from "@sveltejs/kit";

// ============================================================================

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		tz: getLocalTimeZone(),
		locale: locals.locale
	}
};
