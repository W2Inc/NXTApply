// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect, type Cookies } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Auth } from '$lib/auth.svelte';
import type { User } from '@prisma/client';
import { dev } from '$app/environment';
import { PUBLIC_APP_NAME } from '$env/static/public';
import { createTOTPKeyURI, verifyTOTPWithGracePeriod } from '@oslojs/otp';
import * as QR from 'uqr';
import z from 'zod/v4';
import { Formy } from '$lib/index.svelte';


// ============================================================================

export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	otp: z.string()
});

// ============================================================================

function cleanupCookies(cookies: Cookies) {
	cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
	cookies.delete(Auth.OTP_KEY_COOKIE, { path: '/' });
}

// ============================================================================

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.session) {
		redirect(302, '/');
	}

	const userId = cookies.get(Auth.IDENTITY_COOKIE);
	if (!userId) {
		error(403);
	}

	const user = locals.db
		.query<User, string>('SELECT * FROM user WHERE id = ?')
		.get(userId);

	if (!user || user.id !== userId) {
		cleanupCookies(cookies);
		error(401);
	}
	// Already has TFA
	if (user.tfa !== null) {
		redirect(302, '/auth/2fa');
	}

	const key = crypto.getRandomValues(new Uint8Array(Auth.OTP_KEY_LENGTH));
	cookies.set(Auth.OTP_KEY_COOKIE, key.toHex(), {
		path: '/',
		httpOnly: true,
		secure: !dev
	});

	const uri = createTOTPKeyURI(
		PUBLIC_APP_NAME,
		user.email,
		key,
		Auth.OTP_INTERVAL_SECONDS,
		Auth.OTP_DIGIT_LENGTH
	);

	return {
		secret: uri,
		qr: QR.renderSVG(uri, { border: 2, ecc: 'L', pixelSize: 4 })
	};
};

// ============================================================================

export const actions: Actions = {
	default: async ({ locals, cookies, request }) => {
		const key = cookies.get(Auth.OTP_KEY_COOKIE);
		const userId = cookies.get(Auth.IDENTITY_COOKIE);
		if (!key || !userId) {
			cleanupCookies(cookies);
			error(401);
		}

		const form = await request.formData();
		const result = await schema.safeParseAsync(Object.fromEntries(form.entries()));
		if (result.error) {
			return Formy.fail(422, result);
		}

		const formData = result.data;
		const valid = verifyTOTPWithGracePeriod(
			Buffer.from(key, 'hex'),
			Auth.OTP_INTERVAL_SECONDS,
			Auth.OTP_DIGIT_LENGTH,
			formData.otp,
			30
		);

		if (!valid) {
			cleanupCookies(cookies);
			return Formy.fail(400, Formy.Issues.InvalidOTP);
		}

		cleanupCookies(cookies);
		const user = locals.db
			.query<User, [string, string]>('UPDATE user SET tfa = ? WHERE id = ? RETURNING *')
			.get(key, userId);

		if (!user || user.id !== userId) {
			error(401, 'Unauthorized');
		}

		const token = Auth.generateToken();
		await Auth.createSession(locals, token, userId, request.headers.get('user-agent'));
		Auth.setCookie(cookies, token);
		redirect(302, '/');
	}
};
