<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLFormAttributes } from "svelte/elements";

	interface Props extends HTMLFormAttributes {
		children?: Snippet<[ ]>
	}

	const { children, ...rest }: Props = $props();
</script>

<form {...rest}>
	{@render children?.()}
</form>
