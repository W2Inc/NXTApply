// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { generateState, GitHub } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { PUBLIC_APP_URL } from '$env/static/public';
import { OAuth } from '.';
import { ensure } from '$lib/utils';
import Logger from '$lib/logger';

// ============================================================================

export interface UGithub {
	id: string;
	login: string;
	avatar_url: string;
	email: string;
}

// ============================================================================

/** Github Client */
const scopes = ['user'];
export const github = new GitHub(
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	`${PUBLIC_APP_URL}/auth/provider/github/callback`
);

/**
 * Generate authorization URL for GitHub login
 * @param event
 * @returns
 */
export function generate(event: RequestEvent) {
	const state = generateState();
	const url = github.createAuthorizationURL(state, scopes);

	event.cookies.set(OAuth.Cookies.STATE, state, {
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
 * Handle the GitHub OAUTH Callback
 * @param event
 */
export async function callback(event: RequestEvent) {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get(OAuth.Cookies.STATE) ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, { status: 400 });
	}

	const [t, tErr] = await ensure(github.validateAuthorizationCode(code));
	if (tErr) return new Response(null, { status: 400 });

	const response = await fetch('https://api.github.com/user', {
		headers: { Authorization: `Bearer ${t.accessToken()}` }
	});

	const [user, jErr] = await ensure<UGithub>(response.json());
	if (jErr) {
		Logger.err('Failed to convert to JSON', jErr);
		return new Response(null, { status: 500 });
	}

	await OAuth.register(event, {
		providerId: user.id,
		provider: 'github',
		email: user.email,
		verified: true
	});

	redirect(302, '/');
}
