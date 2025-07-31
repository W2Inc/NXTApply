// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { Database } from 'bun:sqlite';
import { runWithLocale } from 'wuchale/run-server';
import { redirect, type Handle, type RequestEvent, type ServerInit } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { DATABASE_URL } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';
import { Auth } from '$lib/auth.svelte';
import type { Session, User } from '@prisma/client';
import { UserFlag } from '$lib/index.svelte';
import Jobs, { current } from './jobs';
import { logger } from '$lib/logger';
import { dev } from '$app/environment';
import { locales } from 'virtual:wuchale/locales';

// ============================================================================

const defaultLocale = Object.keys(locales)[0];
const db: Database = new Database(DATABASE_URL, { strict: true });

// ============================================================================

// NOTE(w2wizard): https://bun.sh/docs/api/sqlite#wal-mode
export const init: ServerInit = async () => {
	db.run(/** @wc-ignore */ 'PRAGMA journal_mode = WAL');
	logger.info(/** @wc-ignore */ 'Starting...');
	Jobs.create('session-cleanup');

	if (!dev) {
		for (const job of current) {
			job.start();
		}
	}
};

// ============================================================================

/** Handle to modify the response html to populate the plausible analytics */
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

const authenticate: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(Auth.SESSION_COOKIE);
	console.log(`Authenticating session with token: ${token}`);
	const redirectToLogin = () => {
		if (!event.route.id?.startsWith('/auth/')) redirect(302, '/auth/sign-in');
		return resolve(event);
	};

	if (!token) {
		return redirectToLogin();
	}

	event.locals.session = await Auth.validateSessionToken(event.locals, token);
	if (!event.locals.session) {
		return redirectToLogin();
	}

	return resolve(event);
};

// ============================================================================

const authorize: Handle = async ({ event, resolve }) => {
	if (event.locals.session?.userId) {
		const user = event.locals.db
			.query<User, string>(/** @wc-ignore */ 'SELECT * FROM user WHERE id = ?')
			.get(event.locals.session.userId);

		event.locals.user = user;
	}

	const user = event.locals.user;
	if (user && event.route.id?.startsWith('/admin')) {
		if ((user.flags & UserFlag.IsAdmin) !== UserFlag.IsAdmin) {
			return new Response(null, { status: 404 });
		}
	}

	return resolve(event);
};

// ============================================================================

export const base: Handle = async ({ event, resolve }) => {
	event.locals.db = db;
	event.setHeaders({
		'x-app': env.PUBLIC_APP_NAME,
	});

	let desiredLocale = event.cookies.get('set-lang');
	let userLocale = desiredLocale ?? event.cookies.get('lang');
	if (!userLocale || !(userLocale in locales)) {
		userLocale = defaultLocale;
	}

	event.cookies.set('lang', userLocale, { path: '/' });
	event.locals.locale = userLocale;
	if (desiredLocale) {
		event.cookies.delete('set-lang', { path: '/' });
	}

	return await runWithLocale(userLocale, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%sveltekit.lang%', userLocale)
		})
	);
};

export const handle = sequence(base, authenticate, authorize, analytics);
