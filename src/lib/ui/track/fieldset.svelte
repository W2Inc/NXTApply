<script lang="ts">
	import { cn } from '$lib/index.svelte';
	import type { HTMLDetailsAttributes, HTMLFieldsetAttributes } from 'svelte/elements';

	interface Props extends HTMLFieldsetAttributes {}

	const { title, class: klass, children, ...rest }: Props = $props();
</script>

<fieldset class={cn('flex flex-1 flex-col rounded border p-2', klass)} {...rest}>
	<legend class="text-muted-foreground mb-[-4px] px-1 text-xs font-medium">{title}</legend>
	{@render children?.()}
</fieldset>
