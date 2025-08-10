import { Auth } from '$lib/auth.svelte';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ResetToken } from '@prisma/client';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) return { new: false };

	const reset = db.query<ResetToken, [string]>('SELECT * FROM reset_token WHERE id = ?').get(token);
	if (!reset) error(400);

	return { token };
};
