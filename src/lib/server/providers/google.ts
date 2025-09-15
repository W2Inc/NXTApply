// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { ensure } from '$lib/utils';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { PUBLIC_APP_URL } from '$env/static/public';
import { generateCodeVerifier, generateState, Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import Logger from '$lib/logger';
import { OAuth } from '@/server/providers';

// SEE: https://developers.google.com/identity/openid-connect/openid-connect
// ============================================================================

const scopes = ['openid', 'profile', 'email'];
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`${PUBLIC_APP_URL}/auth/provider/google/callback`
);

// ============================================================================

interface UGoogle {
	sub: string;
	given_name: string;
	family_name: string;
	email: string;
	email_verified: string;
}

// ============================================================================

export default {
	init: function (event: RequestEvent) {
		const state = generateState();
		const verifier = generateCodeVerifier();
		const url = google.createAuthorizationURL(state, verifier, scopes);

		event.cookies.set(OAuth.Cookies.STATE, state, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax'
		});

		event.cookies.set(OAuth.Cookies.VERIFIER, verifier, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax'
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: url.toString()
			}
		});
	},
	callback: async function (event: RequestEvent) {
		const code = event.url.searchParams.get('code');
		const state = event.url.searchParams.get('state');
		const userState = event.cookies.get(OAuth.Cookies.STATE) ?? null;
		const verifier = event.cookies.get(OAuth.Cookies.VERIFIER) ?? null;
		if (!code || !state || !userState || !verifier || state !== userState) {
			return new Response(null, { status: 400 });
		}

		const [t, tokenErr] = await ensure(google.validateAuthorizationCode(code, verifier));
		if (tokenErr) return new Response(null, { status: 400 });

		const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: { Authorization: `Bearer ${t.accessToken()}` }
		});

		const [user, jerr] = await ensure<UGoogle>(response.json());
		if (jerr) {
			Logger.err('Failed to convert to JSON', jerr);
			return new Response(null, { status: 500 });
		}

		await OAuth.register(event, {
			providerId: user.sub,
			provider: 'google',
			email: user.email,
			verified: !!user.email_verified
		});

		redirect(302, '/');
	}
} satisfies Provider;
