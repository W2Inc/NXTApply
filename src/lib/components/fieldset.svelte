<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		class?: string;
		children: Snippet<[]>;
	}

	const { title, class: klass, children }: Props = $props();
</script>

<fieldset class={cn('rounded border p-2 shadow-sm', klass)}>
	<legend class="px-2 text-xs font-medium text-muted-foreground">
		{title}
	</legend>
	{@render children()}
</fieldset>
