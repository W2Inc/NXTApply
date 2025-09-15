// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import { getRequestEvent } from '$app/server';
import { FormKit } from '$lib/form.svelte';
import { randomWait } from '$lib/utils';
import { Auth } from '@/server/auth';
import { sqlite } from '@/server/db';
import type { User } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { sql } from 'bun';
import { z } from 'zod/v4';

// ============================================================================

const schema = z.object({
	email: z.email(),
	password: z.string().min(4).max(256),
	confirm: z.string().min(4).max(256)
});

// ============================================================================

export const signup = FormKit.declare(schema, async (data) => {
	await randomWait();

	// Confirm Passwords
	const password = await Bun.password.hash(data.password, 'argon2id');
	if (!(await Bun.password.verify(data.confirm, password))) {
		error(422, 'Passwords do not match');
	}

	// Verify User
	const [check] = await sqlite<User[]>`SELECT * FROM user WHERE email = ${data.email}`;
	if (check) {
		error(409, 'Unable to sign in, try a different email.');
	}

	const id = Bun.randomUUIDv7('base64url');
	const user = await sqlite<User>`INSERT INTO user ${sql({
		id,
		hash: password,
		email: data.email
	})} RETURNING *`;

	const { cookies } = getRequestEvent();
	cookies.set(Auth.IDENTITY_COOKIE, user.id, {
		path: '/',
		secure: !dev,
		sameSite: 'strict'
	});

	redirect(302, `/auth/2fa/setup`);
});
