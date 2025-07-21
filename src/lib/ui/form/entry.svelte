<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		name: string;
		label?: string;
		description?: string;
		errors?: string[];
		child?: Snippet<[{ name: string }]>;
	}


	let { name, errors, label = 'Hello!', description, child }: Props = $props();
</script>

<div>
	{#if label}
		<label for={name} class="text-muted-foreground block pb-1 text-xs font-medium">
			{label}
		</label>
	{/if}
	<div class="flex flex-col gap-2">
		{@render child?.({name})}
	</div>
	{#if !errors || errors.length === 0}
		{#if description}
			<span class="text-xs text-muted-foreground py-1">{description}</span>
		{/if}
	{:else}
		{#each errors as error}
			<span class="text-destructive animate-pulse text-xs italic">
				{#if error === 'invalid_format'}
					Invalid format
				{:else}
					Invalid value
				{/if}
			</span>
		{/each}
	{/if}
</div>
