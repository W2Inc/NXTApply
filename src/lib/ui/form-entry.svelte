<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		name: string;
		errors?: string[];
		child?: Snippet<[{ name: string }]>;
	}

	const { name, errors, label = 'Hello!', child, ...rest }: Props = $props();
</script>

<div>
	{#if label}
		<label for={name} class="text-muted-foreground block pb-1 text-xs font-medium">
			{label}
		</label>
	{/if}
	<div class="flex flex-col gap-2">
		{@render child?.({ name })}
	</div>
	{#if errors}
		{#each errors as error}
			<span class="text-destructive animate-pulse text-xs italic">
				{#if error === "invalid_format"}
					Invalid format
				{:else}
					Invalid value
				{/if}
			</span>
		{/each}
	{/if}
</div>
