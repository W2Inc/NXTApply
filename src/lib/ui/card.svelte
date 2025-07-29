<script lang="ts">
	import { cn } from "$lib/index.svelte";
	import type { Snippet } from "svelte";

	interface Props {
		class?: string;
		children?: Snippet<[ ]>;
	}

	const { class: klass, children }: Props = $props();
</script>

<div
	class={cn(
		"bg-card text-card-foreground rounded-lg shadow border p-6",
		klass
	)}>
	{@render children?.()}
</div>