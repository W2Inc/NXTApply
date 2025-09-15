// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { Auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import { form, getRequestEvent } from "$app/server";

// ============================================================================

export const signout = form(async () => {
	const { locals, cookies } = getRequestEvent();
	Auth.invalidate(locals.session.userId);
	cookies.delete(Auth.SESSION_COOKIE, { path: '/' });
	redirect(303, '/auth/signin');
});
