// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { PUBLIC_APP_NAME } from '$env/static/public';
import { createTOTPKeyURI } from '@oslojs/otp';
import * as QR from 'uqr';
import { sqlite } from '$lib/server/db';
import { Auth } from '$lib/server/auth';

// ============================================================================

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const userId = cookies.get(Auth.IDENTITY_COOKIE);
	if (!userId) {
		error(403);
	}

	const [user] = await sqlite`SELECT * FROM user WHERE id = ${userId}`;
	if (!user || user.id !== userId) {
		cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
		cookies.delete(Auth.OTP_KEY_COOKIE, { path: '/' });
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
