// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { page } from "$app/state";
import * as Adobe from "@internationalized/date";

export const UserFlag = {
	IsAdmin: 1 << 2,
	IsVerified: 1 << 3,
	IsBanned: 1 << 4,
	HasPremium: 1 << 5,
	IsGuest: 1 << 6
} as const;

export const ApplicationStepType = {
	Boarding: 0,
	Intermission: 1,
	Challenge: 2,
	Waiting: 3,
	Result: 4
} as const;

// ============================================================================

/**
 * ENSURE that the promise is resolved safely and return the appropriate result.
 * @param promise The promise to ensure / await.
 * @returns Either the result or an error.
 */
export async function ensure<T, E = Error>(promise: Promise<T>): Promise<[T, null] | [null, E]> {
	try {
		const result = await promise;
		return [result, null];
	} catch (error) {
		return [null, error as E];
	}
}

// ============================================================================

export namespace SQLDates {
	/**
	 * Function that takes:
	 * - 2025-08-11 13:07:24 (FROM SQLITEs datetime function)
	 * - 2025-08-11T13:07:24Z
	 * - 1970-01-13T00:00:00.000Z
	 * - Really any other ISO8601 Date and parses it into a ZonedDateTime
	 * @param value
	 */
	export function from(value: string | Date, tz: string) {
		return Adobe.fromDate(new Date(value), tz);
	}

	// Convert to: 2025-08-11 13:07:24
	// export function to(value: Adobe.DateValue, tz: string) {
	// 	return value.toDate(tz).toUTCString()
	// }
}
