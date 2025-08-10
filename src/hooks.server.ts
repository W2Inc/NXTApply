// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { locales } from 'virtual:wuchale/locales';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, ServerInit } from '@sveltejs/kit';
import Jobs from './jobs';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { db } from '$lib/server/db';
import { runWithLocale } from 'wuchale/run-server';
import { Auth } from '$lib/auth.svelte';
import { logger } from '$lib/server/log';

// ============================================================================

const defaultLocale = Object.keys(locales)[0];

// ============================================================================

// NOTE(w2wizard): https://bun.sh/docs/api/sqlite#wal-mode
export const init: ServerInit = async () => {
	logger.info('Starting...');

	db.run('PRAGMA journal_mode = WAL');
	const current = [
		Jobs.schedule('0 0 1,15 * *', ['metric']), // Every half a month (1st and 15th)
		Jobs.schedule('*/15 * * * *', ['session-cleanup']), // Every 15 minutes
		Jobs.schedule('0 0 * * *', ['auto-complete']) // Every day at midnight
	];

	logger.info(`Jobs: ${current.length}`);
	if (!dev) {
		Jobs.create('session-cleanup');
		for (const job of current) {
			job.start();
		}
	}
};

// ============================================================================

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
	const valid = token && await Auth.validateSessionToken(event.locals, token);
	const isAuthPage = event.url.pathname.startsWith('/auth/');
	const isMainAuth = ['/auth/sign-in', '/auth/sign-up'].includes(event.url.pathname);

	const referer = event.request.headers.get('referer');
	const isRemoteFromAuth = event.isRemoteRequest && referer?.startsWith(event.url.origin + '/auth/');

	if (!valid && !isAuthPage && !isRemoteFromAuth) {
		return Response.redirect('/auth/sign-in', 303);
	}
	if (valid && isMainAuth) {
		return Response.redirect('/', 303);
	}

	if (valid) {
		event.locals.session = valid;
	}
	return resolve(event);
};

// ============================================================================

const authorize: Handle = async ({ event, resolve }) => {
	return resolve(event);
};

// ============================================================================

const base: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		'x-app': env.PUBLIC_APP_NAME
	});

	let locale = event.url.searchParams.get('lang') ?? defaultLocale;
	if (!(locale in locales)) {
		locale = defaultLocale;
	}

	event.locals.locale = locale;
	return await runWithLocale(locale, () =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%sveltekit.lang%', locale)
		})
	);
};

// ============================================================================

export const handle = sequence(base, authenticate, authorize, analytics);
