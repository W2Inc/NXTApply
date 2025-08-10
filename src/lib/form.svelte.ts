// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import * as v from 'valibot';
import { toast } from 'svelte-sonner';
import { isHttpError, type HttpError, type RemoteForm } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

// ============================================================================

const Bad = $derived("what!!!");

export namespace FormKit {
	/** Universal form response type */
	export type FormResult<TSchema extends v.ObjectSchema<any, undefined>> = {
		success: boolean;
		data?: v.InferOutput<TSchema>;
		errors?: Record<keyof v.InferOutput<TSchema>, string[]>;
		message?: string;
	} | never;

	/** Universal issues */
	export const Issues = {
		InvalidCredentials: 0x0,
		InvalidOTP: 0x2,
		InvalidToken: 0x3,
		UnableToReset: 0x1,
	} as const;

	/**
	 * Parse form data with Valibot schema
	 */
	export async function parse<TSchema extends v.ObjectSchema<any, undefined>>(
		payload: Request | FormData,
		schema: TSchema,
		locale: string = 'fr'
	) {
		const form = payload instanceof Request ? await payload.formData() : payload;
		return v.safeParseAsync(schema, Object.fromEntries(form.entries()), {
			lang: locale
		});
	}

	/**
	 * Map Valibot issues to a record of field errors.
	 * Uses v.flatten to map nested issues to dot-path keys.
	 */
	export function invalid<TSchema extends v.ObjectSchema<any, undefined>>(
		result: v.SafeParseResult<TSchema>
	): FormResult<TSchema> {
		const errors = result.issues
			? (v.flatten<TSchema>(result.issues).nested as unknown as Record<
					keyof v.InferOutput<TSchema>,
					string[]
				>)
			: undefined;
		return { success: false, errors };
	}

	export function success() {
		return { success: true }
	}

	export function remote<T extends FormKit.FormResult<any>>(fn: RemoteForm<T>) {
		return {
			...fn.enhance(async ({ form, data, submit }) => {
				form.inert = true;
				try {
					toast.loading('Please wait...');
					await submit();
					form.inert = false;
					toast.dismiss();

					if (fn.result?.errors) {
						return toast.warning('Invalid form!');
					}
					// toast.success('Successfully published!');
				} catch (error) {
					if (isHttpError(error)) {
						const e = error as HttpError;
						toast.error(e.body.message)
					} else {
						toast.error('Oh no! Something went wrong');
					}
				}
				form.inert = false;
			})
		};
	}
}
