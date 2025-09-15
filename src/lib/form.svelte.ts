// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { form } from '$app/server';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { isHttpError, type HttpError, type RemoteForm } from '@sveltejs/kit';
import type { MaybePromise } from 'bun';
import { getContext, setContext } from 'svelte';
import { z } from 'zod/v4';
import { ensure } from './utils';

// ============================================================================

export namespace FormKit {
	namespace Types {
		export namespace Validation {
			export type Result<Schema extends StandardSchemaV1> = Error<Schema> | Success<Schema>;
			export type Error<Schema extends StandardSchemaV1> = {
				value?: undefined;
				errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>;
			};

			export type Success<Schema extends StandardSchemaV1> = {
				errors?: undefined;
				value: StandardSchemaV1.InferOutput<Schema>;
			};
		}

		export type ValidationError<Schema extends StandardSchemaV1> = {
			type: 'failure';
			status: 422;
			errors: Validation.Error<Schema>['errors'];
		};

		export type NoContent = { type: 'success'; status: 204 };
		export type Created<Output> = { type: 'success'; status: 201; data: Output };
		export type Ok<Output> = { type: 'success'; status: 200; data: Output };
		export type Result<Schema extends StandardSchemaV1, Output> =
			| ValidationError<Schema>
			| NoContent
			| Created<Output>
			| Ok<Output>
			| void;
	}

	export function declare<Schema extends StandardSchemaV1, Output>(
		schema: Schema,
		fn: (data: StandardSchemaV1.InferOutput<Schema>) => MaybePromise<Types.Result<Schema, Output>>
	): RemoteForm<Types.Result<Schema, Output>> {
		return form<Types.Result<Schema, Output>>(async (data) => {
			let result = await validate(schema, data);
			if (result?.errors) return invalid<Schema>(result.errors);

			return fn(result.value);
		});
	}

	/** Thin wrapper around remote to handle some extra things. */
	export function remote<Schema extends StandardSchemaV1>(
		remote: RemoteForm<Types.Result<Schema, any>>
	) {
		let message = $state<string>();
		let errors = $state<Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>>>({});
		$effect.pre(() => {
			if (remote.result?.status === 422) {
				errors = remote.result.errors;
			} else if (remote.result?.status === 200 && 'message' in remote.result.data) {
				message = remote.result.data.message as string;
			}
		});

		return {
			get message() {
				return message;
			},
			get status() {
				return remote.result?.status ?? 500;
			},
			get pending() {
				return remote.pending;
			},
			get errors() {
				return errors;
			},
			remote: remote.enhance(async ({ submit, form }) => {
				errors = {};
				message = undefined;
				form.inert = true;
				const [, e] = await ensure(submit());
				if (isHttpError(e)) message = (e as HttpError).body.message;
				form.inert = false;
			})
		};
	}

	export const Reply = {
		NoContent: (): Types.NoContent => ({ type: 'success', status: 204 }),
		Ok: <T>(data: T): Types.Ok<T> => ({ type: 'success', status: 200, data }),
		Created: <T>(data: T): Types.Created<T> => ({ type: 'success', status: 201, data })
	};

	export const Input = {
		// Checkbox: (): void => (z)
	};

	async function validate<Schema extends StandardSchemaV1>(
		validator: Schema,
		data: FormData
	): Promise<Types.Validation.Result<Schema>> {
		const form = Object.fromEntries(data.entries());
		let result = validator['~standard'].validate(form) as MaybePromise<
			StandardSchemaV1.Result<StandardSchemaV1.InferOutput<Schema>>
		>;
		if (result instanceof Promise) result = await result;

		if (result.issues === undefined) {
			return { value: result.value } as Types.Validation.Success<Schema>;
		}

		const errors: Partial<Record<keyof StandardSchemaV1.InferInput<Schema>, string[]>> = {};

		for (const issue of result.issues) {
			if (!issue.path) {
				continue;
			}

			const path = issue.path[0] as keyof StandardSchemaV1.InferOutput<Schema>;

			if (!errors[path]) errors[path] = [];
			errors[path].push(issue.message);
		}

		return { errors } as Types.Validation.Error<Schema>;
	}

	function invalid<Schema extends StandardSchemaV1>(
		errors: Types.Validation.Error<Schema>['errors']
	): Types.ValidationError<Schema> {
		return {
			type: 'failure',
			status: 422,
			errors
		};
	}
}
