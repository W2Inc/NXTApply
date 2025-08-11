// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import type { Session } from '@prisma/client';
import { Database } from 'bun:sqlite';
import { db } from './server/db';
import { UTC } from '$lib';
import { getLocalTimeZone, now } from '@internationalized/date';

// ============================================================================

export namespace Auth {
	/**
	 * The length in bytes of the reset token used for password reset functionality.
	 * Longer tokens provide better security against brute force attacks.
	 */
	export const RESET_TOKEN_LENGTH = 40;
	/**
	 * The length of the verification code sent to users.
	 * 8 digits provides a good balance between security and usability.
	 */
	export const VERIFICATION_CODE_LENGTH = 8;
	/**
	 * The name of the cookie used to store the session token in the browser.
	 * This cookie is sent with every request to authenticate the user.
	 */
	export const SESSION_COOKIE = 'session';
	export const IDENTITY_COOKIE = 'identity';
	export const OTP_KEY_COOKIE = 'secrecy';

	export const OTP_KEY_LENGTH = 20;
	export const OTP_DIGIT_LENGTH = 6;
	export const OTP_INTERVAL_SECONDS = 30;

	/**
	 * Generates a cryptographically secure random token with the specified length.
	 *
	 * @param length - The length of the token in bytes. Defaults to 20 bytes which provides good security for most use cases.
	 * @returns A base64url-encoded string representation of the random token.
	 */
	export function generateToken(length: number = 20) {
		const bytes = new Uint8Array(length);
		crypto.getRandomValues(bytes);
		return Buffer.from(bytes).toString('base64url');
	}

	/**
	 * Generates a cryptographically secure random numeric code.
	 * Useful for verification codes sent via SMS or email.
	 *
	 * @param length - The number of digits in the generated code. Defaults to VERIFICATION_CODE_LENGTH (8).
	 * @returns A string containing only numeric characters (0-9) of the specified length.
	 */
	export function generateCode(length: number = VERIFICATION_CODE_LENGTH): string {
		const bytes = new Uint8Array(length);
		crypto.getRandomValues(bytes);
		return Array.from(bytes)
			.map((byte) => byte % 10)
			.join('');
	}

	/**
	 * Creates a new user session in the database.
	 *
	 * @param token - The plain text session token generated for the user.
	 * @param userId - The unique identifier of the user to associate with the session.
	 * @returns A Promise resolving to the created Sessions object.
	 */
	export async function createSession(
		locals: App.Locals,
		token: string,
		userId: string,
		userAgent: string | null = null
	): Promise<Session> {
		const hash = Bun.hash(userAgent ?? 'unknown').toString();
		const hasher = new Bun.CryptoHasher('sha256');
		const id = hasher.update(token).digest().toString('base64url');

		// Invalidate stale sessions for this user
		invalidateSessions(userId, true);

		const session = db
			.query<
				Session,
				[string, string, string]
			>(
				`INSERT INTO session (id, userId, expiresAt, hash)
				 VALUES (?, ?, datetime('now', '+2 days'), ?)
				 RETURNING *`
			)
			.get(id, userId, hash)!;
		return session;
	}

	/**
	 * Validates a session token and retrieves the associated user.
	 * Handles token expiration and automatic session renewal if needed.
	 *
	 * @param token - The plain text session token from the client.
	 * @returns A Promise resolving to an object containing session and user data if valid,
	 *          or null values for both if the session is invalid or expired.
	 */
	export async function validateSessionToken(
		locals: App.Locals,
		token: string
	): Promise<Session | null> {
		const hasher = new Bun.CryptoHasher('sha256');
		const sessionId = hasher.update(token).digest().toString('base64url');
		let session = db.query<Session, string>(`SELECT * FROM session WHERE id = ?`).get(sessionId);
		if (!session) return null;

		// Now let's check expiration
		const atm = now(locals.tz);
		const expiresAt = UTC.parse(session.expiresAt, locals.tz);
		if (atm.compare(expiresAt) >= 0) {
			db.query(`DELETE FROM session WHERE id = ?`).run(session.id);
			return null;
		}

		// Automatic session renewal: if the session is within 1 days of expiration,
		// extend it for another 1 days from the current time
		const oneDayBeforeExpiry = expiresAt.subtract({ days: 1 });
		if (atm.compare(oneDayBeforeExpiry) >= 0) {
			const expiry = UTC.toSQLite(atm.add({ days: 1 }));
			session.expiresAt = new Date(expiry);
			db.query(`UPDATE session SET expiresAt = ? WHERE id = ?`).run(
				expiry,
				session.id
			);
		}

		return session;
	}

	/**
	 * Invalidates (deletes) a single session by its ID.
	 * Used for logging out a user from a specific device.
	 *
	 * @param id - The unique identifier of the session to invalidate.
	 * @returns A Promise that resolves when the session has been deleted.
	 */
	export function invalidateSession(locals: App.Locals, id: string) {
		db.query<Session, string>(`DELETE FROM session WHERE id = ?`).run(id);
	}

	/**
	 * Invalidates (deletes) all sessions for a specific user.
	 * Useful for forcing a user to log out from all devices, for example after a password change.
	 *
	 * @param userId - The unique identifier of the user whose sessions should be invalidated.
	 * @returns A Promise that resolves when all sessions have been deleted.
	 */
	export function invalidateSessions(userId: string, stale = false) {
		if (stale) {
			db.query(`DELETE FROM session WHERE userId = ? AND expiresAt < datetime()`).run(userId);
			return;
		}
		db.query<Session, string>(`DELETE FROM session WHERE userId = ?`).run(userId);
	}

	/**
	 * Creates a password reset token for a user.
	 * Any existing reset tokens for the user are deleted before creating a new one.
	 *
	 * @param userId - The unique identifier of the user requesting a password reset.
	 * @returns A Promise resolving to the generated token ID that can be included in a reset link.
	 */
	export async function createResetToken(locals: App.Locals, userId: string) {
		const tokenId = generateToken(RESET_TOKEN_LENGTH);
		const expiresAt = now(locals.tz).add({ minutes: 30 });

		db.transaction(() => {
			db.query(`DELETE FROM reset_token WHERE userId = ?`).run(userId);
			db.query(`INSERT INTO reset_token (id, userId, expiresAt) VALUES (?, ?, ?)`).run(
				tokenId,
				userId,
				UTC.toSQLite(expiresAt)
			);
		})();

		return tokenId;
	}

	/**
	 * Creates a verification code for email verification.
	 * Any existing verification tokens for the user are deleted before creating a new one.
	 *
	 * @param userId - The unique identifier of the user requesting verification.
	 * @param email - The email address to be verified.
	 * @returns A Promise resolving to the generated verification code to be sent to the user.
	 */
	export async function createVerificationCode(db: Database, userId: string, email: string) {
		const code = generateCode(VERIFICATION_CODE_LENGTH);
		const expiresAt = now(getLocalTimeZone()).add({ minutes: 5 });

		db.transaction(() => {
			db.query(`DELETE FROM verification_token WHERE userId = ?`).run(userId);
			db.query(
				`INSERT INTO verification_token (userId, email, code, expiresAt) VALUES (?, ?, ?, ?)`
			).run(userId, email, code, UTC.toSQLite(expiresAt));
		})();

		return code;
	}

	/**
	 * Sets the session cookie in the user's browser.
	 *
	 * @param cookies - The Cookies API from SvelteKit.
	 * @param token - The plain text session token to store in the cookie.
	 * @param expiresAt - When the cookie should expire, defaults to SESSION_EXPIRES (30 days).
	 * @param domain - Optional domain restriction for the cookie.
	 */
	export function setCookie(
		cookies: Cookies,
		token: string,
		expiresAt: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
		domain?: string
	) {
		cookies.set(SESSION_COOKIE, token, {
			httpOnly: true,
			sameSite: 'lax',
			domain,
			expires: expiresAt,
			path: '/',
			secure: !dev
		});
	}

	/**
	 * Deletes the session cookie from the user's browser.
	 * Used during logout to remove the authentication token.
	 *
	 * @param cookies - The Cookies API from SvelteKit.
	 */
	export function deleteCookie(cookies: Cookies): void {
		cookies.delete(SESSION_COOKIE, {
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 0,
			path: '/'
		});
	}
}
