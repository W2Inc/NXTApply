// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';
import { error, fail as kitFail, redirect } from '@sveltejs/kit';
import type z from 'zod/v4';
import type { ApplicationStep, ApplicationTrack, ApplicationUserTrack, User } from '@prisma/client';

// ============================================================================

export const dateFormatOptions: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	timeZoneName: 'short',
	localeMatcher: 'lookup'
};

// ============================================================================

export const UserFlag = {
	IsAdmin: 1 << 2,
	CompletedBoarding: 1 << 3
} as const;

export const ApplicationStepType = {
	Boarding: 0,
	Intermission: 1,
	Challenge: 2,
	Waiting: 3,
	Result: 4
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
	 * Validate the step, checking the conditionals
	 * @param locals
	 * @param step
	 * @returns
	 */
	private static validateStep<T extends ApplicationStep & { completedAt: Date | null }>(
		locals: App.Locals,
		steps: T[]
	) {
		// Get the current step the user is on.
		// Check the conditionals on that step,

		let current =
			steps.find((s) => !s.completedAt) ?? // Last active step
			steps.find((s) => s.type === ApplicationStepType.Result) ?? //
			error(500, 'Step is configured incorrectly, please contact staff.');

		return step.at(0)!;
	}

	/**
	 * Connect the user to next stage or let them continue.
	 *
	 * @param locals - The application locals containing the database connection.
	 * @param userOrId - The user object or user ID to connect.
	 * @param url - (Optional) The URL associated with the connection.
	 * @returns void
	 */
	public static resolve(locals: App.Locals, userOrId: User | string, url: URL) {
		const user = typeof userOrId === 'string' ? this.getUser(locals, userOrId) : userOrId;
		if (!user) error(404);

		const userTrack = this.getUserTrack(locals, user.id) ?? redirect(303, '/');

		// User hasn't even started yet!
		const steps =
			this.getSteps(locals, userTrack.id, userTrack.trackId) ??
			error(501, 'Track is configured incorrectly, please contact staff.');

		// let current = this.validateStep(locals, steps);

		return {
			track: null,
			steps: [],
			step: steps[0],
			href: null
		};

		// TODO: Indicates that the user hasn't even started yet. Redirect to /
		// const userTrack = this.getUserTrack(locals, user.id);
		// if (!userTrack && url.pathname !== '/') redirect(303, '/');

		// const steps = this.getSteps(locals, userTrack.id, userTrack.trackId);

		// if (!steps.length) error(404);

		// // Find the current step index (first not completed)
		// const currentIndex = steps.findIndex((step) => !step.completedAt);

		// // If all steps are completed, set currentIndex to last
		// const currentStepIndex = currentIndex === -1 ? steps.length - 1 : currentIndex;

		// const currentStep = steps[currentStepIndex];

		// const baseUrl = `/${user.id}`;
		// const specialSteps: Record<number, string> = {
		// 	[ApplicationStepType.Boarding]: `${baseUrl}/boarding`,
		// 	[ApplicationStepType.Intermission]: `${baseUrl}/break`
		// };

		// let href: string | null = null;
		// if (currentStep) {
		// 	const special = specialSteps[currentStep.type];
		// 	href = special ?? `${baseUrl}/step/${currentStep.id}`;
		// 	if (url.pathname === href) {
		// 		href = null;
		// 	}
		// }

		// const track = this.getTrack(locals, userTrack.trackId);

		// return {
		// 	steps,
		// 	current: currentStepIndex,
		// 	track,
		// 	href
		// };
	}

	private static getUser(locals: App.Locals, userId: string): User | null {
		return locals.db.query<User, [string]>(`SELECT * FROM user WHERE id = ?`).get(userId);
	}

	private static getUserTrack(locals: App.Locals, userId: string) {
		return locals.db
			.query<ApplicationUserTrack, [string]>(
				`
				SELECT ut.*, ut.trackId
				FROM user_track ut
				WHERE ut.userId = ?
				LIMIT 1
			`
			)
			.get(userId);
	}

	private static getSteps(locals: App.Locals, userTrackId: string, trackId: string) {
		type ApplicationUserStep = ApplicationStep & { completedAt: string | null };

		return locals.db
			.query<ApplicationUserStep, [string, string]>(
				`
				SELECT s.*, us.completedAt
				FROM application_step s
				LEFT JOIN user_step us ON us.stepId = s.id AND us.userTrackId = ?
				WHERE s.trackId = ?
				ORDER BY s."order"
			`
			)
			.all(userTrackId, trackId);
	}

	private static getTrack(locals: App.Locals, trackId: string): ApplicationTrack | null {
		return locals.db
			.query<ApplicationTrack, [string]>(
				`
				SELECT *
				FROM application_track
				WHERE id = ?
				LIMIT 1
			`
			)
			.get(trackId);
	}
}

// ============================================================================

export namespace Formy {
	export type Error<S extends z.ZodObject> = Record<keyof z.infer<S>, string[]>;
	export type Output<S extends z.ZodObject> = { errors: Error<S>; loading: boolean };

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
	export function fail<T, U>(
		status: number,
		payload: number | z.ZodSafeParseResult<U>,
		rest: T = undefined as T
	) {
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
