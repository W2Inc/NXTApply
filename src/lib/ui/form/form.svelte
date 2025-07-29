<script lang="ts" generics="T">
	import { applyAction, enhance } from '$app/forms';
	import { Formy } from '$lib/index.svelte';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { ClassValue, HTMLFormAttributes } from 'svelte/elements';

	interface Props extends HTMLFormAttributes {
		loading?: boolean;

		after?: (result: ActionResult) => void;
		before?: () => boolean | Promise<boolean>;
		class?: ClassValue;

		fields: Snippet<
			[
				{
					errors: Record<keyof T, string[]>;
					loading: boolean;
				}
			]
		>;
	}

	let errors = $state({} as Record<keyof T, string[]>);
	let { loading = $bindable(false), before, after, fields, class: klass, ...rest }: Props = $props();

	const onSubmit: SubmitFunction = async ({ cancel }) => {
		errors = {} as Record<keyof T, string[]>;
		if (!(before ? await before() : true)) {
			return cancel();
		}

		toast.loading('Loading...');
		return async ({ result }) => {
			toast.dismiss();

			after?.(result);
			if (result.type === 'success' && result.data) {
				toast.success(result.data['message'] || 'Success!');
			} else if (result.type === 'failure' && result.data) {
				const { errors: e, code } = result.data as Formy.FormResult<T>;
				if (e) {
					errors = e;
				} else if (code) {
					toast.error(code);
				} else {
					toast.error('Something went wrong!');
				}
			} else {
				toast.error('Something went wrong!');
			}

			await applyAction(result);
		};
	};

</script>

<form class={klass} method="post" enctype="multipart/form-data" {...rest} use:enhance={onSubmit}>
	{@render fields?.({ errors, loading })}
</form>
