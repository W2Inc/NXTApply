<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { Icon } from 'lucide-svelte';
	import { cn } from '$lib';

	interface Props extends WithElementRef<HTMLInputAttributes> {
		icon?: typeof Icon;
	}

	let {
		ref = $bindable(null),
		value = $bindable(),
		icon: IconImage,
		class: className,
		...restProps
	}: Props = $props();
</script>

{#snippet inputElem(className2?: string)}
	<input bind:this={ref} class={cn('input hover:border-accent w-full', className, className2)} bind:value {...restProps} />
{/snippet}

{#if IconImage}
	<div class="flex flex-col gap-4 sm:flex-row">
		<div class="relative flex-1">
			<IconImage
			size={16}
				class="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform text-base-400"
			/>
			{@render inputElem('pl-8')}
		</div>
	</div>
{:else}
	{@render inputElem()}
{/if}
