<script lang="ts">
	import { DateFormatter } from '@internationalized/date';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		BadgeCheck,
		BadgeX,
		Bookmark,
		Calendar,
		Check,
		ExternalLink,
		Flag,
		LoaderCircle,
		LogOut,
		MapPin,
		SquareCheck,
		StepForward,
		Users,
		X
	} from '@lucide/svelte';
	import { cn, UTC } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { AvailableUserEvent } from './+page.server';
	import { Badge } from '$lib/components/ui/badge';
	import type { join as joinRemote } from '@/remotes/event/join.remote';
	import type { leave as leaveRemote } from '@/remotes/event/leave.remote';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { FormKit } from '$lib/form.svelte';
	import { userCount } from '@/remotes/event/count.remote';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		event: AvailableUserEvent;
		join: ReturnType<typeof joinRemote.for>;
		leave: ReturnType<typeof leaveRemote.for>;
	}

	const { event, join, leave }: Props = $props();
	const formatter = new DateFormatter(page.data.locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const startsAt = $derived(UTC.read(event.startsAt, page.data.tz));
	const completedAt = $derived(UTC.read(event.completedAt, page.data.tz));
	const registerUntil = $derived(UTC.read(event.registerUntil, page.data.tz));
	const expired = $derived(UTC.now(page.data.tz).compare(startsAt) > 0);
	const cutoff = $derived(registerUntil ? UTC.now(page.data.tz).compare(startsAt) > 0 : false);
	const disabled = $derived(expired || !!completedAt || cutoff || !!event.requires);

	// Determine if the event has a track to navigate to
	const hasTrack = $derived(!!event.userEventId && !event.completedAt && event.trackId);

	// Handle redirection to track
	function handleTrackRedirect() {
		if (hasTrack) {
			goto(`/events/${event.id}/track`);
		}
	}
</script>

{#snippet when()}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<span
				id="event-when"
				class={cn('flex items-center gap-1', expired && 'line-through opacity-50')}
			>
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
		</Tooltip.Trigger>
		<Tooltip.Content>Save date to Calendar</Tooltip.Content>
	</Tooltip.Root>
{/snippet}

{#snippet where()}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<span id="event-where" class="flex items-center gap-1">
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
			</span>
		</Tooltip.Trigger>
		<Tooltip.Content>View on Openstreet Map</Tooltip.Content>
	</Tooltip.Root>
{/snippet}

{#snippet who()}
	<svelte:boundary>
		<span id="event-who" class="flex items-center gap-1 text-xs hover:text-primary">
			<Users size={16} class="shrink-0" />
			{await userCount(event.id)}
			{#if event.maxUsers}
				/ {event.maxUsers}
			{/if}
		</span>
		{#snippet pending()}
			<LoaderCircle class="shrink-0 animate-spin" size={16} /> / {event.maxUsers}
		{/snippet}
	</svelte:boundary>
{/snippet}

{#snippet trigger()}
	{#if hasTrack}
		<!-- If the event has a track and user is joined but not completed, use button to redirect -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button
					size="icon"
					id="event-action"
					variant="outline"
					disabled={false}
					onclick={handleTrackRedirect}
					class="size-12 shrink-0"
				>
					<StepForward class="size-6" />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>Continue to event track</Tooltip.Content>
		</Tooltip.Root>
	{:else}
		<!-- User is not joined, use join action -->
		<form>
			<input type="hidden" name="id" value={event.id} />
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						{@const form = event.userEventId ? leave : join}
						<Button
							{...props}
							size="icon"
							id="event-action"
							variant="outline"
							{disabled}
							loading={join.pending > 0}
							{...form.buttonProps}
							class="size-12 shrink-0"
						>
							{#if disabled}
								<X class="size-6" />
							{:else if event.userEventId}
								<LogOut class="size-6" />
							{:else}
								<StepForward class="size-6" />
							{/if}
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					{#if disabled}
						Event is unavailable
					{:else}
						Click to join this event
					{/if}
				</Tooltip.Content>
			</Tooltip.Root>
		</form>
	{/if}
{/snippet}

<li class="flex gap-4 rounded">
	{@render trigger()}
	<div class="min-w-0 flex-1">
		<!-- TOP -->
		<div class="flex items-center gap-2">
			<p class="truncate text-lg font-semibold text-foreground">
				{event.name}
			</p>
			<!-- USER STATUS -->
			{#if event.requires}
				<Badge
					variant="outline"
					class="flex shrink-0 items-center gap-1 bg-orange-400 px-2 text-[10px] text-white shadow"
				>
					<Flag fill-rule="inherit" size={12} />
					Requires: {event.requires}
				</Badge>
			{/if}

			{#if event.userEventId}
				{#if event?.completedAt}
					<Badge
						variant="secondary"
						class="flex shrink-0 items-center gap-1 bg-green-600 px-2 text-[10px] text-white shadow"
					>
						<BadgeCheck size={12} />
						Completed
					</Badge>
				{:else}
					<Badge
						variant="secondary"
						class="flex shrink-0 items-center gap-1 bg-destructive px-2 text-[10px] text-white shadow"
					>
						<BadgeX size={12} />
						Not Completed
					</Badge>
				{/if}
			{/if}

			<Separator orientation="horizontal" class="flex-1" />
		</div>
		<!-- BOTTOM -->
		<div class="flex flex-col gap-1 text-muted-foreground sm:flex-row sm:items-center">
			<div class="min-w-0">{@render who()}</div>
			<span aria-hidden="true" class="hidden sm:inline">•</span>
			<div class="min-w-0">{@render when()}</div>
			{#if event.address}
				<span aria-hidden="true" class="hidden sm:inline">•</span>
				<div class="min-w-0">{@render where()}</div>
			{/if}
		</div>
	</div>
</li>
