<script lang="ts">
	import { BadgeCheck, BadgeX } from '@lucide/svelte';
	import type { ListedUserEvent } from './index.svelte';
	import { Badge } from '../ui/badge';

	interface Props {
		event: ListedUserEvent;
	}

	const { event }: Props = $props();
</script>

{#if event.userEventId}
	{#if event?.completedAt}
		<Badge

			variant="secondary"
			class="flex shrink-0 h-5 items-center gap-1 bg-green-600 px-2 text-[10px] text-white shadow"
		>
			<BadgeCheck size={12} />
			Completed
		</Badge>
	{:else}
		<Badge
			variant="secondary"
			class="flex shrink-0 h-5 items-center gap-1 bg-destructive px-2 text-[10px] text-white shadow"
		>
			<BadgeX size={12} />
			Not Completed
		</Badge>
	{/if}
{/if}
