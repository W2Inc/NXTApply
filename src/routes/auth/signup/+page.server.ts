// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { Toasty } from '$lib';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas';

// ============================================================================

export const actions: Actions = {
	default: async (event) => {
		const { request, cookies, locals } = event;
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const password2 = formData.get('c-password')?.toString();

		if (!email || !password || !password2) {
			return Toasty.fail(422, 'Invalid email or password');
		}

		if (
			password.length < 8 ||
			!/\d/.test(password) ||
			!/[a-z]/.test(password) ||
			!/[A-Z]/.test(password)
		) {
			return Toasty.fail(
				422,
				'Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter'
			);
		}

		if (password !== password2) {
			return Toasty.fail(422, 'Passwords do not match!');
		}

		// Wait a random 25 - 400 ms to prevent timing attacks
		// Returning immediately allows malicious actors to figure out valid usernames from response times
		// By always returning the same / inconsistent response time, we can make it harder to figure out valid usernames
		await new Promise((resolve) => setTimeout(resolve, 25 + Math.random() * 400));

		// Exists ?
		if ((await db.select().from(users).where(eq(users.email, email))).length > 1) {
			return Toasty.fail(409, 'Account with such an email already exists!');
		}

		const user = await db.transaction(async (tx) => {
			const hash = await Bun.password.hash(password, 'argon2id');
			const user = await tx
				.insert(users)
				.values({
					email,
					id: Bun.randomUUIDv7(),
					hash,
					tfa: null
				})
				.returning();
			const createdUser = user.at(0);
			if (!createdUser) tx.rollback();
			return createdUser;
		});

		if (!user) {
			return Toasty.fail(500, 'Failed to create account');
		}

		cookies.set('identity', user.id, {
			path: '/',
			secure: !dev,
			sameSite: 'strict'
		});

		redirect(302, '/auth/2fa/setup');
	}
};
