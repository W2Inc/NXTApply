<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Input } from './ui/input';
	import { Label } from './ui/label';
	import { useId } from 'bits-ui';

	interface Props {
		label?: string;
		description?: string;
		errors?: string[];
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
		<p class="text-xs -mt-1.5 text-destructive animate-pulse">
			{errors.at(0) ?? "Unknown Issue"}
		</p>
	{/if}
</div>
