// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

export const UserFlag = {
	IsAdmin: 1 << 2,
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
