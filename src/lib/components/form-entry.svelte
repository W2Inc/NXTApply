<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Label } from './ui/label';
	import { useId } from 'bits-ui';
	import { TriangleAlert } from '@lucide/svelte';
	import type { RemoteFormIssue } from '@sveltejs/kit';

	interface Props {
		label?: string;
		description?: string;
		errors?: string[] | RemoteFormIssue[];
		child: Snippet<[id: string]>;
	}

	const id = useId();
	const { label, errors, description, child }: Props = $props();
</script>

<div class="flex flex-col gap-1.5 mb-2">
	{#if label}
		<Label for={id}>{label}</Label>
	{/if}
	{@render child(id)}
	{#if description}
		<p class="text- text-muted-foreground">
			{description}
		</p>
	{:else if errors && errors.length}
		{@const error = errors.at(0)}
		<p class="text-xs -mt-1 text-destructive animate-pulse flex gap-1 items-center">
			<TriangleAlert size={12} />
			{#if typeof error === 'string'}
				{error}
			{:else}
				{error?.message}
			{/if}
		</p>
	{/if}
</div>
