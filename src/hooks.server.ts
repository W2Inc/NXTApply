import { PUBLIC_APP_NAME } from "$env/static/public";
import { ensure } from "$lib";
import { Auth } from "$lib/server/auth";
import { error, redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const routes: Record<string, boolean> = {
	"/shop": false,
};

/**
 * The handle hook runs every time the SvelteKit server receives a request and
 * determines the response. Essentially it's middleware.
 *
 * @see https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks
 */
export const handleAuth: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		"x-powered-by": `Bun ${Bun.version}`,
		"x-application": PUBLIC_APP_NAME,
	});

	// Verify session
	const token = event.cookies.get(Auth.SESSION_COOKIE) ?? null;
	if (!token) {
		event.locals.user = undefined;
		event.locals.session = undefined;

		// User is trying to sign in OR
		// Allow non-authenticated access if the route doesn't require authentication
		if (routes[event.url.pathname] === false || event.url.pathname.startsWith("/auth")) {
			return resolve(event);
		}
		// If route requires authentication and no session exists, redirect to signin
		return redirect(301, "/auth/signin");
	}

	// Validate & Create session
	const [r, e] = await ensure(Auth.validateSessionToken(token));
	if (e) error(503, e.message);
	const { session, user } = r;

	if (session !== null) {
		Auth.setCookie(event.cookies, token, session.expiresAt);

		event.locals.user = user;
		event.locals.session = session;
	} else {
		Auth.deleteCookie(event.cookies);
	}

	// Landlord application must only have access to the landlord route
	if (event.url.pathname.startsWith("/auth")) {
		return resolve(event);
	}
	return resolve(event);
};

export const handle = sequence(handleAuth);
