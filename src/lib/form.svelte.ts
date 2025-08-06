// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type z from 'zod/v4';
import * as zLocales from 'zod/locales';
import { toast } from 'svelte-sonner';
import { error, type RemoteForm } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

// ============================================================================


export namespace FormKit {
	export type Output<T> = { errors?: Record<keyof z.infer<T>, string[]> }

	/** Universal issues */
	export const Issues = {
		InvalidValues: 0x0
	} as const;

	export async function parse<T>(
		payload: Request | FormData,
		schema: z.ZodType<T>,
	) {
		const { locals } = getRequestEvent();
		const form = payload instanceof Request ? await payload.formData() : payload;

		/** @ts-ignore We know, no worries if it isn't there we just go back to english*/
		const zodLocale = zLocales[locals.locale] ?? zLocales['en'];
		return schema.safeParseAsync(Object.fromEntries(form.entries()), {
			error: zodLocale().localeError
		});
	}

	export function invalid<T>(payload: z.ZodSafeParseResult<T>): Output<T> {
		if (!payload.error) throw new Error("Payload should have an error")
		return {
			errors: reduceIssues(payload.error.issues) as Record<keyof z.infer<T>, string[]>
		}
	}

	/** Wrapper to enhance remote function */
	export function remote<T extends FormKit.Output<T>>(remoteForm: RemoteForm<T>) {
		return {
			...remoteForm.enhance(async ({ form, data, submit }) => {
				try {
					form.inert = true;
					toast.loading("Please wait...")
					await submit()
					form.inert = false;
					toast.dismiss();

					if (remoteForm.result?.errors) {
						return toast.warning("Invalid form!")
					}
					toast.success('Successfully published!');
				} catch (error) {
					toast.error('Oh no! Something went wrong');
				}
			})
		};
	}

	// Private

	function reduceIssues(issues: z.core.$ZodIssue[]) {
		return issues.reduce(
			(acc, issue) => {
				const path = issue.path[0].toString();
				if (!acc[path]) {
					acc[path] = [];
				}
				acc[path].push(issue.message);
				return acc;
			},
			{} as Record<string, string[]>
		);
	}
}
