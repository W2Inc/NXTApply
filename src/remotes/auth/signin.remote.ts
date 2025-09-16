// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import { getRequestEvent } from '$app/server';
import { FormKit } from '$lib/form.svelte';
import Logger from '$lib/logger';
import { randomWait } from '$lib/utils';
import { Auth } from '@/server/auth';
import { sqlite } from '@/server/db';
import type { User } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod/v4';

// ============================================================================

const schema = z.object({
	email: z.email(),
	password: z.string().min(4).max(256)
});

// ============================================================================

export const signin = FormKit.declare(schema, async (data) => {
	await randomWait();

	const { cookies } = getRequestEvent();
	const [user] = await sqlite<User[]>`SELECT * FROM user WHERE email = ${data.email}`;
	if (!user || !user.hash) {
		error(422, 'User not found or password does not match');
	}

	if (!(await Bun.password.verify(data.password, user.hash))) {
		Logger.dbg('2')
		error(422, 'User not found or password does not match');
	}

	cookies.set(Auth.IDENTITY_COOKIE, user.id, {
		path: '/',
		secure: !dev,
		sameSite: 'strict'
	});

	redirect(302, `/auth/2fa/setup`);
});
