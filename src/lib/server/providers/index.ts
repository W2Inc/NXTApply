// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { sql } from 'bun';
import { sqlite } from '@/server/db';
import { Auth } from '@/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from '@prisma/client';
import { dev } from '$app/environment';
import Logger from '$lib/logger';

// ============================================================================

/** Utility namespace for various OAuth related things */
export namespace OAuth {
	export interface Provider {
		init: (event: RequestEvent) => Response;
		callback: (event: RequestEvent) => Promise<Response | never>;
	}

	export const Cookies = {
		STATE: 'oauth.state',
		VERIFIER: 'oauth.verifier'
	};

	export interface UserInfo {
		/** ID provided by the provider */
		providerId: string;
		provider: string;
		email: string;
		verified: boolean;
	}

	export async function register(event: RequestEvent, info: UserInfo) {
		const [user] = await sqlite<User[]>`
			SELECT * FROM user
			WHERE providerId = ${info.providerId}
			AND provider = ${info.provider}
		`;

		const id = user?.id ?? Bun.randomUUIDv7('base64url');
		if (!user) {
			Logger.dbg('User not found:', info);
			await sqlite`INSERT INTO user ${sql({ id, ...info })}`;
		} else if (user.email !== info.email) {
			Logger.dbg('User email mismatch:', id);
			await sqlite`
				UPDATE user SET email = ${info.email}
				WHERE providerId = ${info.providerId}
				AND provider = ${info.provider}
			`;
		}

		const userAgent = event.request.headers.get('user-agent');
		const session = await Auth.session(id, userAgent);
		event.cookies.set(Auth.SESSION_COOKIE, session.id, {
			path: '/',
			httpOnly: true,
			secure: !dev
		});

		// Clean up any old cookies
		event.cookies.delete(OAuth.Cookies.STATE, { path: '/' });
		event.cookies.delete(OAuth.Cookies.VERIFIER, { path: '/' });
	}
}
