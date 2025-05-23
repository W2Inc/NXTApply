// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas';
import { Toasty } from '$lib';

// ============================================================================

export const load: PageServerLoad = async ({ locals: { session } }) => {

	return {};
};

// ============================================================================

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		// Wait a random 25 - 400 ms to prevent timing attacks
		// Returning immediately allows malicious actors to figure out valid usernames from response times
		// By always returning the same / inconsistent response time, we can make it harder to figure out valid usernames
		await new Promise((resolve) => setTimeout(resolve, 25 + Math.random() * 400));

		if (!email || !password) {
			return Toasty.fail(422, 'Invalid email or password');
		}
		if (email.length < 3 || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return Toasty.fail(422, 'Invalid email or password');
		}

		const userDatas = await db.select().from(users).where(eq(users.email, email)).limit(1);
		const user = userDatas.at(0);
		if (!user || !user.hash) {
			return Toasty.fail(422, 'Invalid email or password');
		}

		const validPassword = await Bun.password.verify(password, user.hash, 'argon2id');
		if (!validPassword) {
			return Toasty.fail(422, 'Invalid email or password');
		}

		cookies.set('identity', user.id, {
			path: '/',
			secure: !dev,
			sameSite: 'strict'
		});

		if (user.tfa === null) {
			return redirect(303, '/auth/2fa/setup');
		}
		return redirect(302, '/auth/2fa');
	}
};
