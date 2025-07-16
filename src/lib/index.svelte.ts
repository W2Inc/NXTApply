// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';
import { error, fail as kitFail } from '@sveltejs/kit';
import type z from 'zod/v4';

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
	export type FormErrorCode = "mismatch" | "taken" | "error"
	export type FormResult<T> = {
		code?: FormErrorCode;
		errors?: Record<keyof T, string[]>;
	};

	function reduceIssues(issues: z.core.$ZodIssue[]) {
		return issues.reduce(
			(acc, issue) => {
				const path = issue.path[0].toString();
				if (!acc[path]) {
					acc[path] = [];
				}
				acc[path].push(issue.code);
				return acc;
			},
			{} as Record<string, string[]>
		);
	}

	/**
	 * Universal way to just simply return a failure with a message.
	 * @param status The status code of the failure
	 * @param message The message of the failure
	 * @returns
	 */
	export function fail<T, U>(
		status: number,
		payload: FormErrorCode | z.ZodSafeParseResult<U>,
		rest: T = undefined as T
	) {
		if (typeof payload === 'string') {
			return kitFail(status, {
				code: payload,
				...rest
			} satisfies FormResult<T>);
		}

		// Not sure when this would happen
		if (!payload.error?.issues) {
			console.error("Form failed but no issues were recorded", payload)
			error(500, 'Something went wrong...');
		}

		return kitFail(status, {
			errors: reduceIssues(payload.error.issues) as Record<keyof T, string[]>,
			...rest
		} satisfies FormResult<T>);
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
