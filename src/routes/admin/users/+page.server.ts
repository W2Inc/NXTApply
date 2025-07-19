import type { User } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod/v4';

const schema = z.object({
	id: z.uuidv7()
});

export type UserActionSchema = z.infer<typeof schema>

export const load: PageServerLoad = async ({ locals, depends, url }) => {
	depends("admin:users");
	const query = url.searchParams.get("q")?.trim() || "";

	let users: User[] = [];

	if (query) {
		users = locals.db.query<User, [string, string, string]>(
			`SELECT * FROM user
			 WHERE
				email LIKE '%' || ? || '%'
				OR firstName LIKE '%' || ? || '%'
				OR lastName LIKE '%' || ? || '%'
			 LIMIT 25`
		).all(query, query, query);
	} else {
		users = locals.db.query<User, []>(
			'SELECT * FROM user ORDER BY createdAt DESC LIMIT 25'
		).all();
	}

	return { users };
};

export const actions: Actions = {
	add: async ({ locals }) => {
		locals.db.query("INSERT INTO ")
	},
	remove: async ({ locals }) => {}
};
