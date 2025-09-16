// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { Handle, ServerInit } from '@sveltejs/kit';
import { locales } from 'virtual:wuchale/locales';
import { loadCatalog, loadIDs, key } from './locales/loader.svelte.js';
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server';
import { sqlite } from '$lib/server/db.js';
import Jobs from './jobs/index.js';
import { env as pubenv } from '$env/dynamic/public';
import { dev } from '$app/environment';
import { sequence } from '@sveltejs/kit/hooks';
import { getUser } from './remotes/user/get.remote.js';
import Logger from '$lib/logger.js';
import { Auth } from '$lib/server/auth.js';
import { UserFlag } from '$lib';

// ============================================================================

export const init: ServerInit = async () => {
	Logger.inf('Starting...');

	await sqlite.connect();
	await loadLocales(key, loadIDs, loadCatalog, locales);

	// See: https://fractaledmind.com/2023/09/07/enhancing-rails-sqlite-fine-tuning/
	await sqlite`PRAGMA journal_mode = WAL`;
	await sqlite`PRAGMA journal_size_limit = 67108864`; // 64MB
	await sqlite`PRAGMA mmap_size = 134217728`; // 128MB
	await sqlite`PRAGMA cache_size = 2000`;
	await sqlite`PRAGMA busy_timeout = 5000`;
	Jobs.create('session-cleanup');

	if (!dev) {
		const current = [
			Jobs.schedule('0 0 1,15 * *', ['metric']), // Every half a month (1st and 15th)
			Jobs.schedule('*/15 * * * *', ['session-cleanup']), // Every 15 minutes
			Jobs.schedule('0 0 * * *', ['auto-complete']) // Every day at midnight
		];

		Logger.inf(`Jobs: ${current.length}`);
		for (const job of current) {
			job.start();
		}
	}
};

// ============================================================================

const authenticate: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(Auth.SESSION_COOKIE);
	const valid = token && (await Auth.validate(event.locals, token));
	const isAuthPage = event.url.pathname.startsWith('/auth/');
	const isMainAuth = ['/auth/signin', '/auth/signup'].includes(event.url.pathname);

	const referer = event.request.headers.get('referer');
	const isRemoteFromAuth =
		event.isRemoteRequest && referer?.startsWith(event.url.origin + '/auth/');

	if (!valid && event.isRemoteRequest) {
		return new Response(null, { status: 401 });
	}
	if (!valid && !isAuthPage && !isRemoteFromAuth) {
		return Response.redirect('/auth/signin', 303);
	}
	if (valid && isMainAuth) {
		return Response.redirect('/', 303);
	}

	if (valid) {
		event.locals.session = valid;
	}
	return resolve(event);
};

const authorize: Handle = async ({ event, resolve }) => {
	// TODO: Cache this ?
	if (event.url.pathname.startsWith('/admin')) {
		const user = await getUser(event.locals.session.userId);
		const userFlags = user?.flags ?? 0;
		if ((userFlags & UserFlag.IsAdmin) !== UserFlag.IsAdmin) {
			return new Response(null, { status: 404 });
		}
	}
	return resolve(event);
};

const analytics: Handle = async ({ event, resolve }) => {
	const domain = pubenv.PUBLIC_PLAUSIBLE_DOMAIN;
	const script = pubenv.PUBLIC_PLAUSIBLE_URL;
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

const locale: Handle = async ({ event, resolve }) => {
	const locale = event.url.searchParams.get('locale') ?? 'en';
	return await runWithLocale(locale, () => resolve(event));
};

// ============================================================================

export const handle = sequence(locale, authenticate, authorize, analytics);
