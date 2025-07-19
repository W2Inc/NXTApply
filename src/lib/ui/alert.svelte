<script lang="ts">
	import { AlertCircle, AlertTriangle, Info, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type AlertVariant = 'info' | 'warning' | 'error';

	interface Props {
		variant?: AlertVariant;
		title?: string;
		description?: string;
		children?: Snippet<[]>;
	}

	let { variant = $bindable<AlertVariant>('info'), title, description, children }: Props = $props();

	const variantStyles = {
		info: {
			color: 'var(--color-primary, var(--color-muted))'
		},
		warning: {
			color: 'var(--color-accent, var(--color-muted))'
		},
		error: {
			color: 'var(--color-destructive, var(--color-muted))'
		}
	};
</script>

<div
	class="bg-card text-card-foreground flex gap-2 rounded-xl border p-3 ps-1 text-sm shadow-md"
	style="--callout-color: {variantStyles[variant].color};"
	role="alert"
>
	<div role="none" class="w-0.5 rounded-sm bg-[var(--callout-color)]/50"></div>

	<div class="text-[var(--callout-color)]">
		{#if variant === 'info'}
			<Info size={20} class="-me-0.5 size-5 fill-[var(--callout-color)]/10" />
		{:else if variant === 'warning'}
			<AlertTriangle size={20} class="-me-0.5 size-5 fill-[var(--callout-color)]/10" />
		{:else if variant === 'error'}
			<AlertCircle size={20} class="-me-0.5 size-5 fill-[var(--callout-color)]/10" />
		{/if}
	</div>

	<div class="flex min-w-0 flex-1 flex-col gap-2">
		{#if title}
			<p class="!my-0 font-medium">
				{title}
			</p>
		{/if}
		<div class="text-muted-foreground prose-no-margin empty:hidden">
			{#if description}
				<p>{description}</p>
			{/if}
			{@render children?.()}
		</div>
	</div>
</div>
