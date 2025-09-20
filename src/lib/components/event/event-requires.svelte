<script lang="ts">
	import type { ListedUserEvent } from './index.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { Badge } from '../ui/badge';

	interface Props {
		event: ListedUserEvent;
	}

	const { event }: Props = $props();
</script>

{#if event.requires}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Badge
					{...props}
					variant="outline"
					class="flex h-5 shrink-0 items-center gap-1 px-2 text-[10px] shadow cursor-help"
				>
					Requires: {event.requires}
				</Badge>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			You need to complete these following event(s) first.
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
