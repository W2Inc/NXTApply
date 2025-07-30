<script lang="ts">
	import { cn } from '$lib/index.svelte';
	import type { HTMLInputTypeAttribute, HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends HTMLSelectAttributes {
		kek: HTMLInputTypeAttribute
	}
	let { value = $bindable(), class: klass, children, ...rest }: Props = $props();
</script>

<select
	bind:value
	class={cn(
		klass,
		'border-input h-8 bg-input focus:ring-primary/40 rounded-lg border px-2 font-sans text-base transition focus:ring-2 focus:outline-none overflow-y-auto',
	)}
	{...rest}
>
	{@render children?.()}
</select>
