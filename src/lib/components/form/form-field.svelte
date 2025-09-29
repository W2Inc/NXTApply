<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useId } from 'bits-ui';
	import { TriangleAlert } from '@lucide/svelte';
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import { Label } from '../ui/label';
	import { cn } from '$lib/utils';

	interface Props {
		id: string;
		label?: string;
		description?: string;
		class?: string;
		errors?: string[] | RemoteFormIssue[];
		children: Snippet<[]>;
	}

	const { id, label, errors, description, children, class: klass }: Props = $props();
</script>

<div class={cn('flex flex-col gap-1 mb-2', klass)}>
	{#if label}
		<Label class="text-xs" for={id}>{label}</Label>
	{/if}
	{@render children()}
	{#if description}
		<p class="text-xs text-muted-foreground">
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
