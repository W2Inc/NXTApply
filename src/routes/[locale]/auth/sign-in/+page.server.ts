// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { Toasty } from '$lib/index.svelte';
import z from 'zod/v4';
import { Database, type SQLQueryBindings } from 'bun:sqlite';
import type { User } from '@prisma/client';

// ============================================================================

const schema = z.object({
	email: z.email(),
	password: z.string().min(4).max(256),
});

export type FormEntries = z.infer<typeof schema>;

// ============================================================================

export const actions: Actions = {
	default: async ({ locals, request, cookies }) => {
		// Wait a random 25 - 400 ms to prevent timing attacks
		// Returning immediately allows malicious actors to figure out valid usernames from response times
		// By always returning the same / inconsistent response time, we can make it harder to figure out valid usernames
		await new Promise((resolve) => setTimeout(resolve, 25 + Math.random() * 400));

		const form = await request.formData();
		const result = await schema.safeParseAsync(Object.fromEntries(form.entries()));
		if (result.error) {
			return Toasty.fail(400, result);
		}

		const formData = result.data;
		const user = locals.db
			.query<User, [string]>('SELECT * FROM user WHERE email = ?')
			.get(formData.email);

		if (!user || !user.hash) {
			return Toasty.fail(404, 'error');
		}

		const match = await Bun.password.verify(formData.password, user.hash);
		if (!match) {
			return Toasty.fail(422, 'error');
		}

		cookies.set('identity', user.id, {
			path: '/',
			secure: !dev,
			sameSite: 'strict'
		});

		redirect(302, `/${locals.locale}/auth/2fa/setup`);
	}
};
