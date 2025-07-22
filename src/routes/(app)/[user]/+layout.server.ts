import type { User } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { Switchboard } from '$lib/index.svelte';

export const load: LayoutServerLoad = async ({ locals, params, url }) => {
	if (locals.user?.id !== params.user) {
		error(404);
	}

	const { step, href, track } = Switchboard.resolve(locals, locals.user, url);
	if (href)
		redirect(303, href);
	return { step, track };
};
