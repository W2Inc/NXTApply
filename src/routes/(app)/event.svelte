<script lang="ts">
	import { DateFormatter } from '@internationalized/date';
	import { page } from '$app/state';
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
	import { join } from '@/remotes/event/join.remote';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { FormKit } from '$lib/form.svelte';
	import { userCount } from '@/remotes/event/count.remote';
	import Button from '$lib/components/ui/button/button.svelte';

	const { event, remote }: { event: AvailableUserEvent; remote: ReturnType<typeof join.for> } =
		$props();
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
</script>

{#snippet when()}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<span id="event-when" class={cn('flex items-center gap-1', expired && 'line-through opacity-50')}>
				<Calendar size={16} class="shrink-0" />
				<a
					href="#"
					inert={expired}
					download={`${event.name}.ics`}
					class="text-xs underline hover:text-primary truncate"
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
					class="text-xs underline hover:text-primary truncate"
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
			{await userCount(event.id)} / {event.maxUsers}
		</span>
		{#snippet pending()}
			<LoaderCircle class="animate-spin shrink-0" size={16} /> / {event.maxUsers}
		{/snippet}
	</svelte:boundary>
{/snippet}

{#snippet trigger()}
	<form {...FormKit.toastify(remote)}>
		<input type="hidden" name="id" value={event.id} />
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({props})}
					<Button
						{...props}
						size="icon"
						id="event-action"
						variant="outline"
						{disabled}
						loading={remote.pending > 0}
						type="submit"
						class="size-12 shrink-0"
					>
						{#if event.userEventId && event.completedAt}
							<Check class="size-6" />
						{:else if event.userEventId}
							<LogOut class="size-6" />
						{:else if disabled}
							<X class="size-6" />
						{:else if event.userEventId}
							<Bookmark class="size-6" />
						{:else}
							<StepForward class="size-6" />
						{/if}
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				{#if event.userEventId && event.completedAt}
					Event is completed
				{:else if event.userEventId}
					Exit event
				{:else if disabled}
					Event is unavailable
				{:else if event.userEventId}
					<Bookmark class="size-6" />
				{:else}
					Click to start this event
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	</form>
{/snippet}

<li class="flex gap-4 rounded">
	{@render trigger()}
	<div class="min-w-0 flex-1">
		<!-- TOP -->
		<div class="flex items-center gap-2">
			<p class="text-lg font-semibold text-foreground truncate">
				{event.name}
			</p>
			<!-- USER STATUS -->
			{#if event.requires}
				<Badge
					variant="outline"
					class="flex items-center gap-1 bg-orange-400 px-2 text-[10px] text-white shadow shrink-0"
				>
					<Flag fill-rule="inherit" size={12} />
					Requires: {event.requires}
				</Badge>
			{/if}

			{#if event.userEventId}
				{#if event?.completedAt}
					<Badge
						variant="secondary"
						class="flex items-center gap-1 bg-green-600 px-2 text-[10px] text-white shadow shrink-0"
					>
						<BadgeCheck size={12} />
						Completed
					</Badge>
				{:else}
					<Badge
						variant="secondary"
						class="flex items-center gap-1 bg-destructive px-2 text-[10px] text-white shadow shrink-0"
					>
						<BadgeX size={12} />
						Not Completed
					</Badge>
				{/if}
			{/if}

			<Separator orientation="horizontal" class="flex-1" />
		</div>
		<!-- BOTTOM -->
		<div class="flex flex-col gap-1 sm:flex-row sm:items-center text-muted-foreground">
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
