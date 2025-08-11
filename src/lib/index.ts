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

/**
 * Handles conversion of date strings to UTC and back.
 * This is useful for ensuring consistent date handling across different time zones.
 */
export namespace UTC {
  /**
   * Returns the current UTC time as a ZonedDateTime with the 'UTC' time zone.
   */
  export function Now(): Adobe.ZonedDateTime {
    return Adobe.now('UTC');
  }

  /**
   * Converts a ZonedDateTime to its UTC equivalent and formats it as a string
   * in the SQLite-compatible format 'YYYY-MM-DD HH:mm:ss' (up to seconds precision).
   */
  export function toSQLite(date: Adobe.ZonedDateTime): string {
    const utcDate = Adobe.toTimeZone(date, 'UTC');
    const year = utcDate.year.toString().padStart(4, '0');
    const month = utcDate.month.toString().padStart(2, '0');
    const day = utcDate.day.toString().padStart(2, '0');
    const hour = utcDate.hour.toString().padStart(2, '0');
    const minute = utcDate.minute.toString().padStart(2, '0');
    const second = utcDate.second.toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  /**
   * Parses a string in SQLite format ('YYYY-MM-DD HH:mm:ss') or a native JS Date
   * into a ZonedDateTime. The optional timeZone parameter specifies the time zone
   * to interpret the input in (default: 'UTC'). For strings, assumes the fields are
   * in the given time zone. For Dates, uses the absolute time and adjusts fields
   * to the given time zone.
   */
  export function parse(input: string | Date, timeZone: string = 'UTC'): Adobe.ZonedDateTime {
    if (typeof input === 'string') {
      // Convert SQLite format to ISO-like for parsing
      const isoString = input.replace(' ', 'T');
      const dateTime = Adobe.parseDateTime(isoString);
      return Adobe.toZoned(dateTime, timeZone);
    } else {
      return Adobe.fromDate(input, timeZone);
    }
  }
}
