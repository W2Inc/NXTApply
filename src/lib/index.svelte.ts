// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';
import { error, fail as kitFail, redirect } from '@sveltejs/kit';
import type z from 'zod/v4';
import type { ApplicationStep, User, UserTrack } from '@prisma/client';

// ============================================================================

export const UserFlag = {
	IsAdmin: 1 << 2,
	CompletedBoarding: 1 << 3,
} as const;

export const ApplicationStepType = {
	Boarding: 0,
	Intermission: 1,
	Challenge: 2,
	Waiting: 3,
	Result: 4,
} as const;

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

/**
 * Switchboard is a utility class that handles the redirection logic for users
 * based on their current state in the application.
 *
 * It checks if the user is in the correct stage of the onboarding process and
 * redirects them accordingly.
 */
export class Switchboard {

	/**
	 * Connect the user to next stage or let them continue.
	 *
	 * @param locals - The application locals containing the database connection.
	 * @param userOrId - The user object or user ID to connect.
	 * @param url - (Optional) The URL associated with the connection.
	 * @returns void
	 */
	public static resolve(locals: App.Locals, userOrId: User | string, url: URL) {
		const user = typeof userOrId === 'string'
			? locals.db.query<User, [string]>(`SELECT * FROM user WHERE id = ?`).get(userOrId)
			: userOrId;

		if (!user)
			error(404);

		/**
		 * Find the current active step for the user.
		 * Returns the ApplicationStep that is not completed yet.
		 */
		const currentStep = locals.db.query<ApplicationStep, [string]>(`
			SELECT s.*
			FROM user_track ut
			JOIN application_step s ON s.trackId = ut.trackId
			LEFT JOIN user_step sc ON sc.userTrackId = ut.id AND sc.stepId = s.id
			WHERE ut.userId = ?
			AND (sc.completedAt IS NULL)
			ORDER BY s."order"
			LIMIT 1
		`).get(user.id);

		const step = currentStep ?? error(404);
		const baseUrl = `/${user.id}`;
		let href: string | null = null;

		const stepTypeToPath: Record<number, string> = {
			[ApplicationStepType.Boarding]: `${baseUrl}/boarding`,
			[ApplicationStepType.Intermission]: `${baseUrl}/break`
		};

		href = stepTypeToPath[step.type] ?? `${baseUrl}/step/${step.id}`;
		if (url.pathname === href) {
			href = null;
		}

		// Only query applicationTrack if no redirect is needed
		type TrackStep = { id: string, type: number; order: number; };
		let track: TrackStep[] = [];
		if (!href) {
			track = locals.db.query<TrackStep, [string]>(`
				SELECT s.id, s.type, s."order"
				FROM user_track ut
				JOIN application_step s ON s.trackId = ut.trackId
				WHERE ut.userId = ?
				ORDER BY s."order"
			`).all(user.id);
		}

		return { step, href, track };
	}
}

// ============================================================================


export namespace Formy {
	export type Error<S extends z.ZodObject> = Record<keyof z.infer<S>, string[]>
	export type Output<S extends z.ZodObject> = { errors: Error<S>, loading: boolean }

	export const Issues = {
		PasswordMismatch: 0x01,
		EmailTaken: 0x02,
		InvalidEmail: 0x03,
		WeakPassword: 0x04,
		MissingField: 0x05,
		InvalidToken: 0x06,
		ExpiredToken: 0x07,
		NotFound: 0x08,
		InvalidCredentials: 0x09,
		InvalidOTP: 0x09,
		UnknownError: 0xff
	} as const;

	export type FormResult<T> = {
		code?: number;
		errors?: Record<keyof T, string[]>;
	};

	/**
	 * Parses form data from a `Request` object and validates it against a given Zod schema.
	 *
	 * @template T - The type inferred from the provided Zod schema.
	 * @param request - The incoming `Request` containing form data.
	 * @param schema - A Zod schema used to validate and parse the form data.
	 * @returns A promise that resolves to the result of `schema.safeParseAsync`, containing either the parsed data or validation errors.
	 */
	export async function parse<T>(request: Request, schema: z.ZodType<T>) {
		const formData = await request.formData();
		const data = Object.fromEntries(formData.entries());
		return schema.safeParseAsync(data);
	}

	/**
	 * Handles failure responses for form submissions, supporting both numeric error codes and Zod validation results.
	 *
	 * @template T - The type of additional data to include in the response.
	 * @template U - The Zod object schema type for validation.
	 * @param status - The HTTP status code to return.
	 * @param payload - Either a numeric error code or a Zod safe parse result containing validation errors.
	 * @param rest - Optional additional data to include in the response.
	 * @returns The result of the failure, formatted for SvelteKit form handling.
	 *
	 * @throws If the payload is a Zod result without error issues, throws a 500 error.
	 */
	export function fail<T, U>(status: number, payload: number | z.ZodSafeParseResult<U>, rest: T = undefined as T) {
		if (typeof payload === 'number') {
			return kitFail(status, {
				code: payload,
				...rest
			} satisfies FormResult<T>);
		}

		if (!payload.error?.issues) {
			error(500, 'Something went wrong...');
		}

		return kitFail(status, {
			errors: reduceIssues(payload.error.issues) as Record<keyof T, string[]>,
			...rest
		} satisfies FormResult<T>);
	}

	/**
	 * Creates a success response object containing a message and additional properties.
	 *
	 * @template T - The type of the additional properties to include in the response.
	 * @param message - The success message to include in the response.
	 * @param rest - Optional additional properties to merge into the response object.
	 * @returns An object containing the message and any additional properties provided.
	 */
	export function success<T>(message: string, rest: T = undefined as T) {
		return { message, ...rest };
	}

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
}
