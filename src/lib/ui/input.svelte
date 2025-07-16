<script lang="ts">
	import type { Icon } from '@lucide/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		icon?: typeof Icon;
	}

	let { id, type = 'text', icon: IconComponent = undefined, value = $bindable(), ...rest }: Props = $props();
</script>

<div
	class="bg-card has-[input:focus-within]:border-primary has-[input:focus-within]:ring-ring flex items-center rounded border pl-3 transition-colors has-[input:focus-within]:ring-1"
>
	{#if IconComponent}
		<div class="text-muted-foreground shrink-0 select-none pr-1">
			<IconComponent size={16} />
		</div>
	{/if}
	<input
		{id}
		{type}
		bind:value
		class:pl-1={IconComponent}
		class="text-foreground placeholder:text-muted-foreground block grow bg-transparent py-1.5 pr-3 text-sm focus:outline-none"
		{...rest}
	/>
</div>
