<script lang="ts">
	import { cn } from '$lib/index.svelte';
	import type { Icon } from '@lucide/svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		icon?: typeof Icon;
		iconSize?: number | string;
	}

	let {
		type,
		value = $bindable(),
		checked = $bindable(),
		class: className,
		icon: IconComponent,
		iconSize = 16,
		...restProps
	}: Props = $props();
	const classes =
		'w-full border-input bg-input text-foreground placeholder:text-muted-foreground focus:ring-primary/40 resize-y rounded-lg border px-2 py-1 font-sans text-base transition focus:ring-2 focus:outline-none';
</script>

{#if type === 'radio' || type === 'range' || type === 'color'}
	<input bind:value {type} class={cn(className)} {...restProps} />
{:else if type === 'checkbox'}
	<input bind:checked type="checkbox" class={cn(className)} {...restProps} />
{:else if IconComponent}
	<div class={cn('relative w-full', className)}>
		{#if IconComponent}
			<span class="pointer-events-none absolute top-1/2 left-2 flex -translate-y-1/2 items-center">
				<IconComponent size={iconSize} />
			</span>
		{/if}
		<input
			{type}
			bind:value
			class:pl-7={IconComponent}
			class={cn(classes, className)}
			{...restProps}
		/>
	</div>
{:else}
	<input {type} bind:value class={cn(classes, className)} {...restProps} />
{/if}
