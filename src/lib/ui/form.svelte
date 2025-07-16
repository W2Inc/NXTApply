<script lang="ts" generics="T">
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { Toasty } from '$lib/index.svelte';

	interface Props extends HTMLFormAttributes {
		isLoading?: boolean;

		type: T;

		child: Snippet<[{ errors: Record<keyof T, string[]> }]>;

		/**
		 * Function to handle submit cancellations.
		 * If for instance you want to confirm a submission.
		 * If false no submit fetch is sent, else it will be submitted.
		 */
		beforeSubmit?: () => boolean | Promise<boolean>;
		/**
		 * Hook to check if the form is currently loading / awaiting a response.
		 * @param isLoading True if is awaiting a response else false.
		 */
		onLoading?: (isLoading: boolean) => void;
		/**
		 * Once a response has been received you can get the action result.
		 * @param result The resulting action of getting the response.
		 */
		onResult?: (result: ActionResult) => void;
	}

	//@ts-ignore
	let errors = $state<Record<keyof T, string[]>>({});
	let {
		isLoading = $bindable(),
		onLoading,
		onResult,
		child,
		onsubmit,
		beforeSubmit,
		...rest
	}: Props = $props();

	export const onSubmit: SubmitFunction = async ({ cancel }) => {
		//@ts-ignore
		errors = {};
		const shouldSubmit = beforeSubmit ? await beforeSubmit() : true;
		if (!shouldSubmit) {
			return cancel();
		}

		onLoading?.((isLoading = true));
		toast.loading('Loading...');

		return async ({ result }) => {
			onLoading?.((isLoading = false));
			onResult?.(result);

			toast.dismiss();
			// if (result.type === 'success' && result.data) {
			// 	toast.success(result.data['message'] || 'Success!');
			// } else if (result.type === 'failure' && result.data) {
			// 	const { errors: e, code } = result.data as Toasty.FormResult<T>;
			// 	if (code) {
			// 		switch (code) {
			// 			case 'mismatch':
			// 				toast.error(mismatch);
			// 				break;
			// 			case 'taken':
			// 				toast.error(taken);
			// 				break;
			// 			default:
			// 				toast.error('Something went wrong...');
			// 				break;
			// 		}
			// 	} else if (e) errors = e;
			// 	else toast.error('Something went wrong!');
			// }

			await applyAction(result);
		};
	};

	const taken = $derived('User is already taken');
	const mismatch = $derived('Password does not match');
</script>

<form method="post" enctype="multipart/form-data" {...rest} use:enhance={onSubmit}>
	{@render child?.({ errors })}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
</style>
