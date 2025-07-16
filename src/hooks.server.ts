// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { Database } from 'bun:sqlite';
import { initRegistry } from 'wuchale/runtime';
import { redirect, type Handle, type ResolveOptions, type ServerInit } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { DATABASE_URL } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';
import { Auth } from '$lib/auth.svelte';
import type { Session, User } from '@prisma/client';
import { UserFlag } from '$lib/types';
import TTLCache from '@isaacs/ttlcache';

// ============================================================================

const locales = ['en', 'es', 'fr'];
const runWithCatalog = await initRegistry();
const db: Database = new Database(DATABASE_URL, { strict: true });
// const cache = new TTLCache<string, { user: User; session: Session }>({ ttl: 1_800_000 });

export const init: ServerInit = async () => {
	// NOTE(w2wizard): https://bun.sh/docs/api/sqlite#wal-mode
	db.run('PRAGMA journal_mode = WAL;');
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
	const redirectToLogin = () => {
		if (!event.route.id?.startsWith('/[locale]/auth/') && !event.route.id?.startsWith('/oauth/')) {
			redirect(302, '/en/auth/sign-in');
		}
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

const authorize: Handle = async ({ event, resolve }) => {
	if (event.locals.session?.userId) {
		const user = event.locals.db
			.query<User, string>('SELECT * FROM user WHERE id = ?')
			.get(event.locals.session.userId);

		event.locals.user = user;
	}

	const user = event.locals.user;
	if (user && event.route.id?.startsWith('/[locale]/admin')) {
		if ((user.flags & UserFlag.IsAdmin) !== UserFlag.IsAdmin)
			return new Response(null, { status: 404 });
	}

	return resolve(event);
};
// ============================================================================

export const base: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		'x-app': env.PUBLIC_APP_NAME,
		'x-powered-by': `Bun ${Bun.version}`
	});

	event.locals.db = db;
	const locale = event.params.locale ?? event.cookies.get('lang') ?? 'en';
	const validLocale = locales.find((l) => l === locale) ? locale : 'en';

	// Redirect to locale-prefixed URL if accessing root-level path
	if (!event.route.id?.startsWith('/[locale]/auth/') && !event.route.id?.startsWith('/oauth/')) {
		console.log(event.url.pathname)
		if (!event.url.pathname.startsWith(`/${validLocale}`)) {
			redirect(302, `/${validLocale}${event.url.pathname}${event.url.search}`);
		}
	}

	const catalog = await import(`./locales/${validLocale}.svelte.js`);
	return await runWithCatalog(catalog, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%sveltekit.lang%', validLocale)
		})
	);
};

export const handle = sequence(base, authenticate, authorize, analytics);
