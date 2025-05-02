// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';
import { fail as kitFail } from "@sveltejs/kit";

// ============================================================================

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

/** Wrapper functions for handling universal toasts by awaited forms.*/
export namespace Toasty {
	/**
	 * Universal way to just simply return a failure with a message.
	 * @param status The status code of the failure
	 * @param message The message of the failure
	 * @returns
	 */
	export function fail<T>(status: number, message: string, rest: T = undefined as T) {
		return kitFail(status, { message, ...rest });
	}

	/**
	 * Universal way to just simply return a success with a message.
	 * @param message The message of the success
	 * @param rest Any other data to return
	 * @returns
	 */
	export function success<T>(message: string, rest: T = undefined as T) {
		return { message, ...rest };
	}
}
