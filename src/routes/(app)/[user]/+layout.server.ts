import type { User } from '@prisma/client';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const { db } = locals;
	return {
		user: db.query<User, string>('SELECT * FROM user WHERE id = ?').get(params.user) ?? error(404)
	};
};
