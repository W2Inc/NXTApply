// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { z } from 'zod/v4';
import { ensure } from './utils';
import { toast } from 'svelte-sonner';
import { isHttpError, type ActionResult, type RemoteForm } from '@sveltejs/kit';

// ============================================================================

export namespace FormKit {
	export type NoContent = { type: 'success'; status: 204 };
	export type Ok<Output> = { type: 'success'; status: 200; data: Output };
	export type Created<Output> = { type: 'success'; status: 201; data: Output };
	export type Message = { type: 'message'; status: 200; data: string };
	export type Result<Output> = NoContent | Ok<Output> | Created<Output> | Message;

	export const Reply = {
		NoContent: (): NoContent => ({ type: 'success', status: 204 }),
		Ok: <T>(data: T): Ok<T> => ({ type: 'success', status: 200, data }),
		Created: <T>(data: T): Created<T> => ({ type: 'success', status: 201, data }),
		Message: (data: string): Message => ({ type: 'message', status: 200, data })
	};

	export function toastify(rm: RemoteForm<any, Result<any>> | Omit<RemoteForm<any, Result<any>>, 'for'>) {
		return rm.enhance(async ({ submit, form }) => {
			form.inert = true;

			// Check if we Sveltekit's 'error' was used.
			const [_, err] = await ensure(submit());
			if (isHttpError(err)) {
				toast.error(err.body.message);
			} else if (rm.result?.type === 'message') {
				toast.info(rm.result.data);
			} else if (rm.result?.type === 'success') {
				toast.success('Success!');
			}

			form.inert = false;
		});
	}

	export const Input = {
		Checkbox: () => z.union([z.undefined(), z.literal('on')]).transform((val) => val === 'on')
	};
}
