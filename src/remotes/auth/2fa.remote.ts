// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod';
import { FormKit } from '$lib/form.svelte';
import { form, getRequestEvent } from '$app/server';
import { Auth } from '$lib/server/auth';
import { error, redirect, type Cookies } from '@sveltejs/kit';
import { verifyTOTPWithGracePeriod } from '@oslojs/otp';
import { sqlite } from '$lib/server/db';
import type { User } from '@prisma/client';
import { dev } from '$app/environment';
import Logger from '$lib/logger';

// ============================================================================

const schema = z.object({
	otp: z.string()
});

const deleteCookies = (cookies: Cookies) => {
	cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
	cookies.delete(Auth.OTP_KEY_COOKIE, { path: '/' });
};

function verifyOtpCode(key: string, otp: string): boolean {
	return verifyTOTPWithGracePeriod(
		Buffer.from(key, 'hex'),
		Auth.OTP_INTERVAL_SECONDS,
		Auth.OTP_DIGIT_LENGTH,
		otp,
		30
	);
}

// ============================================================================

export const setOTP = form(schema, async (data) => {
	const { cookies, request } = getRequestEvent();
	const key = cookies.get(Auth.OTP_KEY_COOKIE);
	const userId = cookies.get(Auth.IDENTITY_COOKIE);

	if (!key || !userId) {
		deleteCookies(cookies);
		error(401);
	}

	if (!verifyOtpCode(key, data.otp)) {
		deleteCookies(cookies);
		error(422);
	}

	deleteCookies(cookies);
	const [user] = await sqlite<User[]>`
		UPDATE user SET tfa = ${key}
		WHERE id = ${userId}
		RETURNING *
	`;

	if (!user || user.id !== userId) {
		Logger.dbg('Nope!!!1');
		error(401);
	}
	const agent = request.headers.get('user-agent');
	const session = await Auth.session(userId, agent);
	cookies.set(Auth.SESSION_COOKIE, session.id, {
		path: '/',
		httpOnly: true,
		secure: !dev
	});
	redirect(302, '/');
});

export const verifyOTP = form(schema, async (data) => {
	const { cookies, request } = getRequestEvent();
	const userId = cookies.get(Auth.IDENTITY_COOKIE);

	if (!userId) {
		error(401);
	}

	const [user] = await sqlite<User[]>`SELECT * FROM user WHERE id = ${userId}`;
	if (!user || user.id !== userId) {
		cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
		error(401);
	}

	if (!user.tfa) redirect(307, `/auth/2fa/setup`);

	cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
	if (!verifyOtpCode(user.tfa, data.otp)) error(400);

	const agent = request.headers.get('user-agent');
	const session = await Auth.session(userId, agent);
	cookies.set(Auth.SESSION_COOKIE, session.id, {
		path: '/',
		httpOnly: true,
		secure: !dev
	});
	redirect(302, '/');
});
