<script lang="ts">
	import { BadgeCheck, BadgeX, Clock, ClockFading } from '@lucide/svelte';
	import type { ListedUserEvent } from './index.svelte';
	import { Badge } from '../ui/badge';
	import * as Tooltip from '../ui/tooltip';
	import { DateFormatter } from '@internationalized/date';
	import { page } from '$app/state';

	interface Props {
		event: ListedUserEvent;
		cutoff: boolean;
	}

	const { event, cutoff }: Props = $props();
	const formatter = new DateFormatter(page.data.locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
</script>

{#if event.userEventId}
	{#if event?.completedAt}
		<Badge
			variant="secondary"
			class="flex h-5 shrink-0 items-center gap-1 bg-green-600 px-2 text-[10px] text-white shadow"
		>
			<BadgeCheck size={12} />
			Completed
		</Badge>
	{:else}
		<Badge
			variant="secondary"
			class="flex h-5 shrink-0 items-center gap-1 bg-destructive px-2 text-[10px] text-white shadow"
		>
			<BadgeX size={12} />
			Not Completed
		</Badge>
	{/if}
{/if}
{#if cutoff && !event.completedAt}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Badge
					{...props}
					variant="secondary"
					class="flex h-5 shrink-0 items-center gap-1 bg-gray-500 px-2 text-[10px] text-white shadow"
				>
					<ClockFading size={12} />
					Registration Closed
				</Badge>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>
				Registrations are closed
				{#if event.registerUntil}
					since {formatter.format(new Date(event.registerUntil))}
				{/if}
			</p>
			{#if event.userEventId}
				You may unregister, but cannot re-register
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
