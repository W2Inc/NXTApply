// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { User } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod/v4';
import { Toasty } from '$lib/index.svelte';
import { UserFlag, type FormOutputObject } from '$lib/utils';

// ============================================================================

export type FormUserAction = FormOutputObject<typeof actionSchema>;
const actionSchema = z.object({
	id: z.base64url()
});


// ============================================================================

export type FormUserExport = FormOutputObject<typeof exportSchema>;
const exportSchema = z.object({
	page: z.number().min(0)
});


// ============================================================================

export const load: PageServerLoad = async ({ locals, depends, url }) => {
	depends('admin:users');
	const query = url.searchParams.get('q')?.trim() || '';

	let users: User[] = [];

	if (query) {
		users = locals.db
			.query<User, [string, string, string]>(
				`SELECT * FROM user
			 WHERE
				email LIKE '%' || ? || '%'
				OR firstName LIKE '%' || ? || '%'
				OR lastName LIKE '%' || ? || '%'
			 LIMIT 25`
			)
			.all(query, query, query);
	} else {
		users = locals.db.query<User, []>('SELECT * FROM user ORDER BY createdAt DESC LIMIT 25').all();
	}

	return { users };
};

export const actions: Actions = {
	remove: async ({ locals, request }) => {
		const form = await request.formData();
		const result = await actionSchema.safeParseAsync(Object.fromEntries(form.entries()));
		if (result.error) {
			console.log(result.error);
			return Toasty.fail(400, 'error');
		}


		const { id } = result.data;
		if (!locals.user || (locals.user.flags & UserFlag.IsAdmin) === 0) {
			return Toasty.fail(403, 'error');
		}
		if (id === locals.user.id) {
			return Toasty.fail(400, 'error');
		}

		locals.db.query('DELETE FROM user WHERE id = ?').run(id);
		return Toasty.success('Deleted');
	}
};
