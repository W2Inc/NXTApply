// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { ensure } from '$lib';
import { Auth } from '$lib/server/auth';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/public';

// ============================================================================

const routes: Record<string, boolean> = {
	'/dashboard': true
};

// ============================================================================

// <script defer data-domain="nxtapply" src="https://plausible-q4os0ks4g0koc8gos80448cg.hamette.net/js/script.outbound-links.tagged-events.local.js"></script>

const analytics: Handle = async ({ event, resolve }) => {
	const domain = env.PUBLIC_PLAUSIBLE_DOMAIN;
	const script = env.PUBLIC_PLAUSIBLE_URL;
	const analyticsTag =
		domain !== undefined && script !== undefined
			? `<script defer data-domain="${domain}" src="${script}"></script>`
			: '';

	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			if (html.includes('%sveltekit.analytics%')) {
				return html.replace('%sveltekit.analytics%', analyticsTag);
			}
			return html;
		}
	});
};

// ============================================================================

/**
 * The handle hook runs every time the SvelteKit server receives a request and
 * determines the response. Essentially it's middleware.
 *
 * @see https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks
 */
export const handleAuth: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		'x-powered-by': `Bun ${Bun.version}`,
		'x-application': env.PUBLIC_APP_NAME
	});


	// Verify session
	const token = event.cookies.get(Auth.SESSION_COOKIE) ?? null;
	if (!token) {
		event.locals.session = undefined;

		// User is trying to sign in OR
		// Allow non-authenticated access if the route doesn't require authentication
		if (routes[event.url.pathname] === false || event.url.pathname.startsWith('/auth')) {
			return resolve(event);
		}
		// If route requires authentication and no session exists, redirect to signin
		// TODO: Automatic redirect query for QoL
		return redirect(302, '/auth/signin');
	}

	// Validate & Create session
	const [session, e] = await ensure(Auth.validateSessionToken(token));
	if (e) error(500, e.message);
	if (session) {
		Auth.setCookie(event.cookies, token, session.expiresAt);
		event.locals.session = session;
	} else {
		Auth.deleteCookie(event.cookies);
	}

	return resolve(event);
};

export const handle = sequence(analytics, handleAuth);
