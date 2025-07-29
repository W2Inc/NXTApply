<script lang="ts">
	import { cn } from '$lib/index.svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {}

	let { value = $bindable(), class: klass, ...rest }: Props = $props();
</script>

<textarea
	bind:value
	class={cn(
		'border-input bg-input text-foreground placeholder:text-muted-foreground focus:ring-primary/40 min-h-[4rem] w-full resize-y rounded-lg border px-4 py-3 font-sans text-xs transition focus:ring-2 focus:outline-none',
		klass
	)}
	{...rest}
></textarea>
