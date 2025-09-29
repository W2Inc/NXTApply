<script lang="ts">
	import {
		BadgeCheck,
		BadgeX,
		Calendar,
		ExternalLink,
		MapPin
	} from '@lucide/svelte';
	import type { ListedUserEvent } from './index.svelte';
	import { page } from '$app/state';
	import { DateFormatter, ZonedDateTime } from '@internationalized/date';
	import { cn } from '$lib/utils';

	interface Props {
		event: ListedUserEvent;
		startsAt: ZonedDateTime;
		expired: boolean;
	}

	const { event, startsAt, expired }: Props = $props();
	const formatter = new DateFormatter(page.data.locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
</script>

<div class="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
	<span id="event-when" class={cn('flex items-center gap-1', expired && 'line-through opacity-50')}>
		<Calendar size={16} class="shrink-0" />
		<a
			href="#"
			inert={expired}
			download={`${event.name}.ics`}
			class="truncate text-xs underline hover:text-primary"
			title="Save to calendar"
		>
			{formatter.format(startsAt.toDate())}
		</a>
	</span>
	<span aria-hidden="true" class="hidden sm:inline">•</span>

	<span id="event-where" class="flex items-center gap-1">
		{#if event.address}
			<MapPin size={15} class="shrink-0" />
			<a
				href={`https://maps.apple.com/?q=${encodeURIComponent(event.address)}`}
				target="_blank"
				rel="noopener noreferrer"
				class="truncate text-xs underline hover:text-primary"
			>
				{event.address}
			</a>
			<ExternalLink size={12} class="shrink-0" />
		{:else}
			Online
		{/if}
	</span>
</div>
