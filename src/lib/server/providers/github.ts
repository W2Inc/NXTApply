// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { generateState, GitHub, OAuth2Tokens } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import type { User } from '@prisma/client';
import { Auth } from '$lib/auth.svelte';
import { db } from '../db';

// ============================================================================

export interface GithubUser {
	id: number;
	login: string;
	avatar_url: string;
	email: string;
}

// ============================================================================

/** Github Client */
export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, null);

/**
 *
 * @param event
 * @returns
 */
export function generate(event: RequestEvent) {
	const state = generateState();
	const url = github.createAuthorizationURL(state, []);

	event.cookies.set('oauth_state', state, {
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
 * Handle the OAUTH Callback
 * @param event
 */
export async function callback(event: RequestEvent) {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('oauth_state') ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, { status: 400 });
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		return new Response(null, { status: 400 });
	}

	const response = await fetch('https://api.github.com/user', {
		headers: { Authorization: `Bearer ${tokens.accessToken()}` }
	});

	const ghUser = (await response.json()) as GithubUser;
	const providerId = ghUser.id.toString();

	let userId: string;
	const user = db
		.query<User, [string]>('SELECT * FROM user WHERE providerId = ? AND provider = "github"')
		.get(providerId);

	if (user) {
		// Update email if needed
		if (user.email !== ghUser.email) {
			db.query<User, [string, string]>(
				'UPDATE user SET email = ? WHERE providerId = ? AND provider = "github"'
			).get(ghUser.email, providerId);
		}
		userId = user.id;
	} else {
		// Create new user
		userId = Bun.randomUUIDv7('base64url');
		db.query<User, [string, string, string, string, boolean]>(
			`INSERT INTO user (id, providerId, provider, email, verified) VALUES (?, ?, ?, ?, ?) RETURNING *`
		).get(userId, providerId, 'github', ghUser.email, true);
	}

	// Set up authentication and redirect
	const token = Auth.generateToken();
	await Auth.createSession(event.locals, token, userId,  event.request.headers.get('user-agent'));
	Auth.setCookie(event.cookies, token);
	redirect(302, `/`);
}
