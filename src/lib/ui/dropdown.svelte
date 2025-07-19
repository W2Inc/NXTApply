<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		trigger: Snippet<[open: boolean]>;
		children?: Snippet;
		open?: boolean;
	}

	let detail: HTMLDetailsElement;
	let { open = $bindable(false), trigger, children }: Props = $props();
	function toggleDropdown() {
		// Close all other dropdowns
		document.querySelectorAll<HTMLDetailsElement>('details').forEach((details) => {
			if (details !== detail) {
				details.open = false;
			}
		});
	}
</script>

<details bind:this={detail} class="relative" bind:open={open}>
	<summary
		onclick={() => toggleDropdown()}
		class="hover:bg-accent flex cursor-pointer list-none items-center gap-2 rounded p-2 select-none"
	>
		{@render trigger(open)}
	</summary>
	<div class="bg-popover absolute right-0 z-30 rounded-md border shadow-md">
		{@render children?.()}
	</div>
</details>

<style>
	summary::-webkit-details-marker {
		display: none;
	}
</style>
