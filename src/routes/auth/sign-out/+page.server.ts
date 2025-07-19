import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Auth } from '$lib/auth.svelte';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		const session = locals.session;
		if (session) {
			locals.db.query('DELETE FROM session WHERE id = ?').get(session.id);
			cookies.delete(Auth.SESSION_COOKIE, { path: '/' });
		}
		redirect(303, '/auth/sign-in');
	}
};
