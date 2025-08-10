import { db } from '$lib/server/db';
import type { User } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user =
		db.query<User, [string]>('SELECT * FROM user WHERE id = ?').get(locals.session.userId) ??
		error(500, "User doesn't exist.");

	return {
		user
	};
};
