// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import z from 'zod/v4';
import { Database, type SQLQueryBindings } from 'bun:sqlite';
import type { User } from '@prisma/client';
import { Formy } from '$lib/index.svelte';

// ============================================================================

export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	email: z.email(),
	password: z.string().min(4).max(256),
	confirm: z.string().min(4).max(256),
	first: z
		.string()
		.min(1)
		.max(256)
		.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/),
	last: z
		.string()
		.min(1)
		.max(256)
		.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
});


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
			return Formy.fail(400, result);
		}
		if (result.data.password !== result.data.confirm) return Formy.fail(422, Formy.Issues.PasswordMismatch);

		const formData = result.data;
		const existingUser = locals.db
			.query<User, [string]>('SELECT * FROM user WHERE email = ?')
			.get(formData.email);

		if (existingUser) {
			return Formy.fail(409, Formy.Issues.UnknownError);
		}

		const id = Bun.randomUUIDv7("base64url");
		const hash = await Bun.password.hash(formData.password, 'argon2id');
		locals.db
			.query<
				User,
				[string, string, string, string, string]
			>(`INSERT INTO user (id, hash, email, firstName, lastName) VALUES (?, ?, ?, ?, ?) RETURNING *`)
			.get(id, hash, formData.email, formData.first, formData.last);

		cookies.set('identity', id, {
			path: '/',
			secure: !dev,
			sameSite: 'strict'
		});

		redirect(302, `/${locals.locale}/auth/2fa/setup`);
	}
};
