<script lang="ts">
	import { HelpCircle } from '@lucide/svelte';
	import type { HTMLDetailsAttributes } from 'svelte/elements';

	interface Props extends HTMLDetailsAttributes {}

	const { children }: Props = $props();
</script>

<details class="border-muted bg-muted/40 cursor-help rounded-lg border">
	<summary
		class="text-primary flex items-center gap-1 underline focus:ring-primary/30 rounded font-semibold hover:underline focus:ring-2 focus:outline-none"
	>
		<HelpCircle size={14}/> Read More
	</summary>
	<div class="mt-2 space-y-3 text-sm">
		{@render children?.()}
	</div>
</details>
