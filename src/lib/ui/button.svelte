<script lang="ts">
	import { cn } from '$lib/index.svelte';
	import type { Icon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';

	const baseClasses =
		'inline-flex items-center justify-center rounded text-sm font-medium transition-colors focus:ring-primary/40 focus:ring-2 focus:outline-none cursor-pointer';

	const variantClasses = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		outline: 'border border-input bg-card hover:bg-accent hover:text-accent-foreground',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
		icon: 'h-9 w-9 p-0 rounded-full hover:bg-accent hover:text-accent-foreground'
	};

	const sizeClasses = {
		default: 'h-9 px-4 py-2',
		sm: 'h-7 px-3 text-xs',
		lg: 'h-11 px-8'
	};

	// Override size classes for icon variant to maintain aspect ratio
	const iconSizeClasses = {
		default: 'h-9 w-9',
		sm: 'h-7 w-7',
		lg: 'h-11 w-11'
	};

	interface Props extends HTMLButtonAttributes {
		icon?: typeof Icon;
		href?: string;
		class?: ClassValue;
		variant?: 'default' | 'outline' | 'ghost' | 'icon';
		size?: 'default' | 'sm' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		children: Snippet;
	}

	let {
		href = undefined,
		icon: IconComponent = undefined,
		variant = 'default',
		size = 'default',
		disabled = false,
		type = 'button',
		children,
		class: klass,
		...rest
	}: Props = $props();
</script>

{#snippet icon()}
	{#if IconComponent}
		<span class={variant === 'icon' ? '' : 'pr-1'}>
			<IconComponent size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
		</span>
	{/if}
{/snippet}

{#if href}
	<a
		{href}
		class={cn(
			baseClasses,
			variantClasses[variant],
			variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size],
			'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
			klass
		)}
		aria-disabled={disabled ? true : undefined}
		tabindex={disabled ? -1 : undefined}
	>
		{@render icon()}
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={cn(
			baseClasses,
			variantClasses[variant],
			variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size],
			'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
			klass
		)}
		{...rest}
	>
		{@render icon()}
			{@render children?.()}
	</button>
{/if}
