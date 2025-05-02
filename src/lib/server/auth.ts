// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import { eq } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';
import { db } from './db';
import {
	getLocalTimeZone,
	now as dateNow,
	fromDate,
	type DateValue
} from '@internationalized/date';
import {
	resetTokens,
	sessions,
	users,
	verificationTokens,
	type Sessions,
	type User
} from './db/schemas';

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
	 * The default expiration time for a user session.
	 * Sessions automatically expire after 30 days from creation.
	 */
	export const SESSION_EXPIRES = dateNow(getLocalTimeZone()).add({ days: 30 });
	/**
	 * The name of the cookie used to store the session token in the browser.
	 * This cookie is sent with every request to authenticate the user.
	 */
	export const SESSION_COOKIE = 'session';
	/** Cryptographic hasher used to convert plain text tokens to secure hashes.*/
	const hasher = new Bun.CryptoHasher('sha256');

	/**
	 * Defines the possible return types from session validation.
	 * Either returns valid session and user data, or null values if validation fails.
	 */
	export type SessionValidationResult =
		| { session: Sessions; user: User }
		| { session: null; user: null };

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
	export async function createSession(token: string, userId: string): Promise<Sessions> {
		const session: Sessions = {
			userId,
			id: hasher.update(token).digest().toString('base64url'),
			expiresAt: SESSION_EXPIRES.toDate()
		};

		await db.insert(sessions).values(session);
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
	export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
		const sessionId = hasher.update(token).digest().toString('base64url');
		const result = await db
			.select({ user: users, session: sessions })
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(eq(sessions.id, sessionId));

		if (result.length < 1) {
			return { session: null, user: null };
		}

		const { user, session } = result[0];
		const now = dateNow(getLocalTimeZone());
		const expirationDate = fromDate(session.expiresAt, getLocalTimeZone());

		// Check if session has expired
		if (now.compare(expirationDate) >= 0) {
			await db.delete(sessions).where(eq(sessions.id, session.id));
			return { session: null, user: null };
		}

		// Automatic session renewal: if the session is within 15 days of expiration,
		// extend it for another 30 days from the current time
		const fifteenDaysBeforeExpiry = expirationDate.subtract({ days: 15 });
		if (now.compare(fifteenDaysBeforeExpiry) >= 0) {
			const newExpiryDate = now.add({ days: 30 }).toDate();
			session.expiresAt = newExpiryDate;
			await db
				.update(sessions)
				.set({
					expiresAt: newExpiryDate
				})
				.where(eq(sessions.id, session.id));
		}

		return { session, user };
	}

	/**
	 * Invalidates (deletes) a single session by its ID.
	 * Used for logging out a user from a specific device.
	 *
	 * @param id - The unique identifier of the session to invalidate.
	 * @returns A Promise that resolves when the session has been deleted.
	 */
	export async function invalidateSession(id: string) {
		await db.delete(sessions).where(eq(sessions.id, id));
	}

	/**
	 * Invalidates (deletes) all sessions for a specific user.
	 * Useful for forcing a user to log out from all devices, for example after a password change.
	 *
	 * @param userId - The unique identifier of the user whose sessions should be invalidated.
	 * @returns A Promise that resolves when all sessions have been deleted.
	 */
	export async function invalidateSessions(userId: string) {
		await db.delete(sessions).where(eq(sessions.userId, userId));
	}

	/**
	 * Creates a password reset token for a user.
	 * Any existing reset tokens for the user are deleted before creating a new one.
	 *
	 * @param userId - The unique identifier of the user requesting a password reset.
	 * @returns A Promise resolving to the generated token ID that can be included in a reset link.
	 */
	export async function createResetToken(userId: string) {
		return await db.transaction(async (tx) => {
			const tokenId = generateToken(RESET_TOKEN_LENGTH);
			const expiresAt = dateNow(getLocalTimeZone()).add({ minutes: 30 }).toDate();

			await tx.delete(resetTokens).where(eq(resetTokens.userId, userId));
			await tx.insert(resetTokens).values({
				id: tokenId,
				userId,
				expiresAt
			});

			return tokenId;
		});
	}

	/**
	 * Creates a verification code for email verification.
	 * Any existing verification tokens for the user are deleted before creating a new one.
	 *
	 * @param userId - The unique identifier of the user requesting verification.
	 * @param email - The email address to be verified.
	 * @returns A Promise resolving to the generated verification code to be sent to the user.
	 */
	export async function createVerificationCode(userId: string, email: string) {
		return await db.transaction(async (tx) => {
			await tx.delete(verificationTokens).where(eq(verificationTokens.userId, userId));
			const code = generateCode(VERIFICATION_CODE_LENGTH);

			await tx.insert(verificationTokens).values({
				expiresAt: dateNow(getLocalTimeZone()).add({ minutes: 5 }).toDate(),
				userId,
				email,
				code
			});

			return code;
		});
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
		expiresAt: Date = SESSION_EXPIRES.toDate(),
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
