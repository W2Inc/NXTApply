<script lang="ts">
	import { cn } from '$lib';
	import { Button, type WithChild, type WithChildren, type WithoutChildren } from 'bits-ui';
	import type { Icon } from 'svelte-sonner';

	type Props = WithChildren<Button.RootProps> & {
		class?: string;
		icon?: Icon;
	};

	let {
		icon: IconImage,
		children,
		class: className,
		...rest
	}: Props = $props();
</script>

<Button.Root
	class={cn(
		'bg-background text-foreground hover:bg-muted inline-flex cursor-pointer items-center justify-center rounded border px-3 py-1.5 text-sm font-medium transition-colors',
		className
	)}
	{...rest}
>
	{@render children?.()}
</Button.Root>
