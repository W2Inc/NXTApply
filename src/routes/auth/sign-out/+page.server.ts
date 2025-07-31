import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Auth } from '$lib/auth.svelte';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		const session = locals.session;
		if (session) {
			Auth.invalidateSession(locals, session.id);
			cookies.delete(Auth.SESSION_COOKIE, { path: '/' });
		}
		redirect(303, '/auth/sign-in');
	}
};
