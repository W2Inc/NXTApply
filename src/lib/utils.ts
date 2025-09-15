// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { twMerge } from 'tailwind-merge';
import * as Adobe from '@internationalized/date';
import { clsx, type ClassValue } from 'clsx';

// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Recursively convert all Date occurrences in a type to string.
 * - Dates -> string
 * - Arrays / readonly arrays -> element mapped recursively
 * - Objects (including tuples) -> mapped recursively
 * - Functions and primitives are left intact
 */
export type ISO<T> = T extends Date
	? string
	: T extends (...args: any[]) => any
		? T
		: T extends ReadonlyArray<infer U>
			? ReadonlyArray<ISO<U>>
			: T extends Array<infer U>
				? ISO<U>[]
				: T extends object
					? { [K in keyof T]: ISO<T[K]> }
					: T;

// ============================================================================

/**
 * ENSURE that the promise is resolved safely and return the appropriate result.
 *
 * Allows for GO style error handling.
 *
 * @param promise The promise to ensure / await.
 * @returns Either the result or an error.
 */
export async function ensure<T, E = Error>(promise: Promise<T>): Promise<[T, null] | [null, E]> {
	try {
		return [await promise, null];
	} catch (error) {
		return [null, error as E];
	}
}

export function randomWait() {
	return new Promise((resolve) => setTimeout(resolve, 25 + Math.random() * 400));
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export namespace UTC {
	export function now(): Adobe.ZonedDateTime {
		return Adobe.now('UTC');
	}

	export function write(date: Adobe.ZonedDateTime): string {
		const utcDate = Adobe.toTimeZone(date, 'UTC');
		const year = utcDate.year.toString().padStart(4, '0');
		const month = utcDate.month.toString().padStart(2, '0');
		const day = utcDate.day.toString().padStart(2, '0');
		const hour = utcDate.hour.toString().padStart(2, '0');
		const minute = utcDate.minute.toString().padStart(2, '0');
		const second = utcDate.second.toString().padStart(2, '0');
		return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	}

	export function read(input: string | Date, timeZone: string = 'UTC'): Adobe.ZonedDateTime {
		if (typeof input === 'string') {
			const dateTime = Adobe.parseDateTime(input.replace(' ', 'T'));
			return Adobe.toZoned(dateTime, timeZone);
		} else {
			return Adobe.fromDate(input, timeZone);
		}
	}
}
