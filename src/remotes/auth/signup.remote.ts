// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import { form, getRequestEvent } from '$app/server';
import { randomWait } from '$lib/utils';
import { Auth } from '@/server/auth';
import { sqlite } from '@/server/db';
import type { User } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { sql } from 'bun';
import { z } from 'zod';

// ============================================================================

const schema = z.object({
	email: z.email(),
	_confirm: z.string().min(4).max(256),
	_password: z.string().min(4).max(256),
});

// ============================================================================

export const signup = form(schema, async (data) => {
	await randomWait();

	// Confirm Passwords
	const { cookies } = getRequestEvent();
	const password = await Bun.password.hash(data._password, 'argon2id');
	if (!(await Bun.password.verify(data._confirm, password))) {
		error(422, 'Passwords do not match');
	}

	// Verify User
	const [check] = await sqlite<User[]>`SELECT * FROM user WHERE email = ${data.email}`;
	if (check) {
		error(409, 'Unable to sign in, try a different email.');
	}

	const id = Bun.randomUUIDv7('base64url');
	await sqlite<User>`INSERT INTO user ${sql({
		id,
		hash: password,
		email: data.email
	})} RETURNING *`;

	cookies.set(Auth.IDENTITY_COOKIE, id, {
		path: '/',
		secure: !dev,
		sameSite: 'strict'
	});

	redirect(302, `/auth/2fa/setup`);
});
