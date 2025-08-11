import { db } from '$lib/server/db';
import type { User } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	if (!params.id) return { user: null };
	return {
		user: db.query<User, string>('SELECT * FROM user WHERE id = ?').get(params.id) ?? error(404)
	};
};
