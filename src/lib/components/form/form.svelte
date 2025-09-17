<script lang="ts">
	import type { HTMLFormAttributes } from "svelte/elements";

	interface Props extends HTMLFormAttributes {

	}

	const { children, ...rest }: Props = $props();
</script>

<form {...rest}>
	{@render children?.()}
</form>
