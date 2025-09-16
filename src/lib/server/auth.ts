// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { getRequestEvent } from '$app/server';
import type { Session, User, VerificationToken } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { now } from '@internationalized/date';
import { sqlite } from './db';
import { getUser } from '@/remotes/user/get.remote';
import { sql } from 'bun';
import { UTC, type ISO } from '$lib/utils';
import Logger from '$lib/logger';

// ============================================================================

export namespace Auth {
	export const OTP_KEY_LENGTH = 20;
	export const OTP_DIGIT_LENGTH = 6;
	export const OTP_INTERVAL_SECONDS = 30;

	export const OTP_KEY_COOKIE = 'secrecy';
	export const SESSION_COOKIE = 'session';
	export const IDENTITY_COOKIE = 'identity';

	export const SESSION_DAYS_VALID = 2;
	export const RESET_HOURS_VALID = 4;

	// Using Bun SQL tagged template literals for queries
	// const getUser = (id: string) => sqlite<User[]>`SELECT * FROM user WHERE id = ${id}`;
	// const getSession = (id: string) => sqlite<Session[]>`SELECT * FROM session WHERE id = ${id}`;

	/**
	 * Generate a general purpose token.
	 * @param length The lenght of the token.
	 * @returns A get cryptographically strong random base64url encoded string.
	 */
	export function token(length: number = 20) {
		const bytes = new Uint8Array(length);
		crypto.getRandomValues(bytes);
		return Buffer.from(bytes).toString('base64url');
	}


	/**
	 * Retrieve the authenticated user associated with the current request event.
	 *
	 * This function must be invoked from a server-side remote data request context.
	 * It reads the current request event (via getRequestEvent()) and enforces that
	 * the event is both a remote request and a data request before resolving the user.
	 *
	 * @param flags - Optional bitmask of required user flags. When provided, the user
	 *   must have all bits set (check performed as: (user.flags & flags) === flags).
	 * @returns The authenticated user object for the current request.
	 * @throws {Error} If called outside of a remote/data request context.
	 * @throws {Error} 401 Unauthorized - if no authenticated user is found for the request.
	 * @throws {Error} 403 Forbidden - if a user is found but does not have the required flags.
	 *
	 * @example
	 * // Require only an authenticated user
	 * const currentUser = await user();
	 *
	 * // Require the user to have specific flags (e.g. ADMIN)
	 * const admin = await user(FLAGS.ADMIN);
	 */
	export async function user(flags?: number) {
		const { locals, isRemoteRequest, isDataRequest, isSubRequest } = getRequestEvent();
		if (!isRemoteRequest || !isDataRequest || !isSubRequest)
			throw new Error(`Inproper usage of fn: 'user'`);

		Logger.dbg('Requesting user');
		const user = (await getUser(locals.session.userId)) ?? error(401);
		if (flags && (user.flags & flags) !== flags) error(403);
		return user;
	}

	/**
	 * Get OR Create a new session for a user.
	 * @param userId The user ID to create this session for.
	 * @param agent Optional user-agent, to uniquefiy the session.
	 */
	export async function session(userId: string, agent: string | null = null) {
		return await sqlite.transaction(async (tx) => {
			// NOTE(W2): Ensure to use some form of 'random' data.
			const now = UTC.now();
			const hash = Bun.hash(agent ?? Bun.randomUUIDv7()).toString();

			if (agent) {
				const [oldSession] = await tx<ISO<Session>[]>`
					SELECT * FROM session
					WHERE userId = ${userId}
					AND hash = ${hash}
				`;

				if (oldSession) {
					const expiresAt = UTC.read(oldSession.expiresAt);
					if (now.compare(expiresAt) < 0) {
						return oldSession;
					}

					await tx`DELETE FROM session WHERE id = ${oldSession.id}`;
				}
			}

			// Create a new session if none exists or previous one was expired
			const token = Auth.token();
			const crypto = new Bun.CryptoHasher('sha256');
			const id = crypto.update(token).digest().toString('base64url');
			const expiresAt = UTC.write(now.add({ days: SESSION_DAYS_VALID }));
			const session: ISO<Session> = { id, userId, expiresAt, hash };
			await tx`INSERT INTO session ${sql(session)} RETURNING *`;
			return session;
		});
	}

	/**
	 * User's store their session token in cookies, this should validate
	 * the token and automatically extend it for another day if they
	 * keep using it. Avoids having to constantly re-login.
	 *
	 * @param token The token to validate
	 */
	export async function validate(locals: App.Locals, token: string) {
		// const hasher = new Bun.CryptoHasher('sha256');
		// const sessionId = hasher.update(token).digest().toString('base64url');

		const [session] = await sqlite<Session[]>`SELECT * FROM session WHERE id = ${token}`;
		if (!session) return null;

		const atm = now(locals.tz);
		const expiresAt = UTC.read(session.expiresAt);
		if (atm.compare(expiresAt) >= 0) {
			await sqlite`DELETE FROM session WHERE id = ${session.id}`;
			return null;
		}

		// Automatic session renewal: if the session is within 1 days of expiration,
		// extend it for another 1 days from the current time
		const oneDayBeforeExpiry = expiresAt.subtract({ days: 1 });
		if (atm.compare(oneDayBeforeExpiry) >= 0) {
			const expiry = UTC.write(atm.add({ days: 1 }));
			session.expiresAt = new Date(expiry);
			await sqlite`UPDATE session SET expiresAt = ${expiry} WHERE id = ${session.id}`;
		}

		return session;
	}

	/**
	 *
	 * @param userId
	 * @returns
	 */
	export async function reset(userId: string) {
		const token = Auth.token();
		const expirestAt = UTC.now().add({ hours: 1 });

		await sqlite.begin(async (tx) => {
			await tx`DELETE FROM reset_token WHERE userId = ${userId}`;
			await tx`INSERT INTO reset_token (id, userId, expiresAt)
				VALUES (${token}, ${userId}, ${UTC.write(expirestAt)})`;
		});

		return token;
	}

	/**
	 * Create and store an email verification token for a user.
	 * @param userId
	 * @returns token
	 */
	export async function submit(email: string) {
		const [user] = await sqlite<User[]>`SELECT * FROM user WHERE email = ${email}`;
		if (!user) return null;

		const token = Auth.token();
		const expiresAt = UTC.now().add({ hours: 24 });

		await sqlite.begin(async (tx) => {
			await tx`DELETE FROM verification_token WHERE userId = ${user.id}`;
			await tx`INSERT INTO verification_token (code, email, userId, expiresAt)
				VALUES (${token}, ${user.email}, ${user.id}, ${UTC.write(expiresAt)})`;
		});

		return token;
	}

	/**
	 * Consume a verification token and return the associated user id if valid.
	 * The token will be removed whether expired or consumed.
	 * @param token
	 * @returns userId | null
	 */
	export async function verify(token: string) {
		const [record] = await sqlite<ISO<VerificationToken>[]>`
			SELECT * FROM verification_token WHERE code = ${token}
		`;

		if (!record) return false;

		const nowUtc = UTC.now();
		const expiresAt = UTC.read(record.expiresAt);

		// Ensure the token is removed whether expired or consumed, and if valid mark user verified.
		await sqlite.begin(async (tx) => {
			await tx`DELETE FROM verification_token WHERE code = ${token}`;
			if (nowUtc.compare(expiresAt) < 0) {
				await tx`UPDATE user SET verified = 1 WHERE id = ${record.userId}`;
			}
		});

		if (nowUtc.compare(expiresAt) >= 0) return false;
		return true;
	}

	/**
	 * Invalidate sessions of a user, optionally only old ones.
	 * @param userId Who's session to clear
	 * @param stale If only outdated sessions should be clear.
	 */
	export async function invalidate(id: string, type: 'user' | 'session' = 'user') {
		switch (type) {
			case 'user':
				await sqlite`DELETE FROM session WHERE userId = ${id}`;
				break;
			case 'session':
				await sqlite`DELETE FROM session WHERE id = ${id}`;
				break;
			default:
				throw new Error(`Not implemented: ${type}`);
		}
	}
}
