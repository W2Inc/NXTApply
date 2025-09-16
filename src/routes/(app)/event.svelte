<script lang="ts">
	import { DateFormatter, fromDate, now } from '@internationalized/date';
	import { page } from '$app/state';
	import {
		BadgeCheck,
		BadgeX,
		Calendar,
		CheckCircle,
		CircleAlert,
		ExternalLink,
		MapPin
	} from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import type { AvailableUserEvent } from './+page.server';
	import { Badge } from '$lib/components/ui/badge';
	import { FormKit } from '$lib/form.svelte';
	import { join } from '@/remotes/event/join.remote';

	const { event }: { event: AvailableUserEvent } = $props();
	const formatter = new DateFormatter(page.data.locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const form = FormKit.remote(join);
	const starts = $derived(new Date(event.startsAt));
	const registerUntil = $derived(event.registerUntil ? new Date(event.registerUntil) : null);
	const completedAt = $derived(event.completedAt ? new Date(event.completedAt) : null);
	const expired = $derived(now(page.data.tz).compare(fromDate(starts, page.data.tz)) > 0);
	const isCutoff = $derived(
		registerUntil ? now(page.data.tz).compare(fromDate(registerUntil, page.data.tz)) > 0 : false
	);
	const disabled = $derived(expired || !!completedAt || isCutoff || !!event.requires);
</script>

<li class="flex flex-col gap-4 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
	<div class="flex-shrink-0 self-start">
		<div
			class="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-primary shadow-sm"
		>
			<CheckCircle size={22} />
		</div>
	</div>
	<div class="min-w-0 flex-1">
		<p class={cn('text-lg font-semibold text-foreground', expired && 'line-through opacity-50')}>
			{event.name}
			{#if event.userEventId}
				{#if event?.completedAt}
					<Badge variant="secondary" class="bg-green-500 text-[8px] text-white dark:bg-green-600">
						<BadgeCheck />
						Completed
					</Badge>
				{:else}
					<Badge variant="secondary" class="bg-red-500 text-[8px] text-white dark:bg-red-600">
						<BadgeX />
						Not Completed
					</Badge>
				{/if}
			{/if}
		</p>
		<!-- <p class="text-foreground text-xs">{event.description}</p> -->
		<div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
			<span class={cn('inline-flex items-center gap-1', expired && 'line-through opacity-50')}>
				<Calendar size={16} class="inline-block" />
				<a
					inert={expired}
					href="#"
					download={`${event.name}.ics`}
					class="text-xs underline hover:text-primary"
					title="Save to calendar"
				>
					{formatter.format(starts)}
				</a>
			</span>
			{#if event.address}
				<span aria-hidden="true">•</span>
				<span class="inline-flex items-center gap-1">
					<MapPin size={15} class="inline-block" />
					<a
						href={`https://maps.apple.com/?q=${encodeURIComponent(event.address)}`}
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs underline hover:text-primary"
					>
						{event.address}
					</a>
					<ExternalLink size={12} />
				</span>
			{/if}
		</div>
		{#if event.requires && !expired}
			<hr class="my-0.5" />
			<p class="flex items-center gap-1 text-xs text-destructive">
				<CircleAlert size={12} />
				You must have completed the following events first:
				<span class="capitalize">
					{event.requires}
				</span>
			</p>
		{/if}
	</div>
	{#if event.trackId || !event.userEventId}
		<form class="mt-2 flex items-center gap-2 sm:mt-0" {...form.remote}>
			<input type="hidden" name="id" value={event.id} />
			<Button type="submit" {disabled}>
				{#if event.userEventId && event.trackId}
					Resume
				{:else}
					Register
				{/if}
			</Button>
		</form>
	{/if}
</li>
