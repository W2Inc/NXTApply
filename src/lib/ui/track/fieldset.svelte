<script lang="ts">
	import type { HTMLDetailsAttributes, HTMLFieldsetAttributes } from 'svelte/elements';

	interface Props extends HTMLFieldsetAttributes {}

	const { title, children }: Props = $props();
</script>

<fieldset class="flex flex-1 flex-col rounded border p-2">
	<legend class="text-muted-foreground mb-[-4px] px-1 text-xs font-medium">{title}</legend>
	<div class="flex gap-2 flex-col">
		{@render children?.()}
	</div>
</fieldset>
