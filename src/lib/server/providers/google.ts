// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { generateState, generateCodeVerifier, Google, OAuth2Tokens } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import type { User } from '@prisma/client';
import { Auth } from '$lib/auth.svelte';

// ============================================================================

export interface GoogleUser {
	sub: string;
	name: string;
	email: string;
	picture?: string;
	email_verified?: boolean;
}

// ============================================================================

/** Google Client */
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	"http://localhost:5174/auth/provider/google/callback"
);

/**
 * Generate authorization URL for Google login
 * @param event
 * @returns
 */
export function generate(event: RequestEvent) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

	event.cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set('code_verifier', codeVerifier, {
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
}

/**
 * Handle the Google OAUTH Callback
 * @param event
 */
export async function callback(event: RequestEvent) {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('oauth_state') ?? null;
	const codeVerifier = event.cookies.get('code_verifier') ?? null;

	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		return new Response(null, { status: 400 });
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		return new Response(null, { status: 400 });
	}

	// Decode JWT token to get user info
	const payload = JSON.parse(atob(tokens.idToken().split('.')[1]));
	const googleUser: GoogleUser = {
		sub: payload.sub,
		name: payload.name,
		email: payload.email,
		picture: payload.picture,
		email_verified: payload.email_verified
	};

	const { db, locale } = event.locals;
	const providerId = googleUser.sub;

	let userId: string;
	const user = db
		.query<User, [string]>('SELECT * FROM user WHERE providerId = ? AND provider = "google"')
		.get(providerId);

	if (user) {
		// Update email if needed
		if (user.email !== googleUser.email) {
			db.query<User, [string, string]>(
				'UPDATE user SET email = ? WHERE providerId = ? AND provider = "google"'
			).get(googleUser.email, providerId);
		}
		userId = user.id;
	} else {
		// Create new user
		userId = Bun.randomUUIDv7('base64url');
		db.query<User, [string, string, string, string, boolean]>(
			`INSERT INTO user (id, providerId, provider, email, verified) VALUES (?, ?, ?, ?, ?) RETURNING *`
		).get(userId, providerId, 'google', googleUser.email, !!googleUser.email_verified);
	}

	// Set up authentication and redirect
	const token = Auth.generateToken();
	await Auth.createSession(event.locals, token, userId, event.request.headers.get('user-agent'));
	Auth.setCookie(event.cookies, token);
	redirect(302, `/`);
}
