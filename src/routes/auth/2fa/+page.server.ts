// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Auth } from '$lib/server/auth';

// ============================================================================

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!cookies.get(Auth.IDENTITY_COOKIE)) {
		return error(401, 'Unauthorized');
	}
};
