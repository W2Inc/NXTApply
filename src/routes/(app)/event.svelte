<script lang="ts">
	import { DateFormatter, fromDate, now } from '@internationalized/date';
	import type { AvailableUserEvent } from './+layout.server';
	import { cn, dateFormatOptions, fromDateToInput } from '$lib/index.svelte';
	import { page } from '$app/state';
	import { Calendar, CircleAlert, ExternalLink, MapPin } from '@lucide/svelte';
	import Button from '$lib/ui/button.svelte';
	import { joinEvent } from '$lib/remotes/event.remote';
	import { FormKit } from '$lib/form.svelte';
	import { registerEvent } from './app.remote';

	const { event }: { event: AvailableUserEvent } = $props();
	export const formatter = new DateFormatter(page.data.locale, dateFormatOptions);

	const starts = $derived(new Date(event.startsAt));
	const registerUntil = $derived(event.registerUntil && new Date(event.registerUntil));
	const completedAt = $derived(event.completedAt && new Date(event.completedAt));
	const expired = $derived(now(page.data.tz).compare(fromDate(starts, page.data.tz)) > 0);
	const isCutoff = $derived(registerUntil ? now(page.data.tz).compare(fromDate(registerUntil, page.data.tz)) > 0 : false);
	const disabled = $derived(expired || !!completedAt || isCutoff || !!event.requires);
</script>

<li class="flex flex-col gap-4 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
	<div class="flex-shrink-0 self-start">
		<div
			class="bg-muted text-primary border-border flex h-12 w-12 items-center justify-center rounded-lg border shadow-sm"
		>
			<Calendar size={22} />
		</div>
	</div>
	<div class="min-w-0 flex-1">
		<p class={cn('text-foreground text-lg font-semibold', expired && 'line-through opacity-50')}>
			{event.name}
		</p>
		<!-- <p class="text-foreground text-xs">{event.description}</p> -->
		<div class="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
			<span class={cn('inline-flex items-center gap-1', expired && 'line-through opacity-50')}>
				<Calendar size={16} class="inline-block" />
				<a
					inert={expired}
					href="#"
					download={`${event.name}.ics`}
					class="hover:text-primary text-xs underline"
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
						class="hover:text-primary text-xs underline"
					>
						{event.address}
					</a>
					<ExternalLink size={12} />
				</span>
			{/if}
		</div>
		{#if event.requires && !expired}
			<hr class="my-0.5" />
			<p class="text-destructive flex items-center gap-1 text-xs">
				<CircleAlert size={12} />
				You must have completed the following events first:
				<span class="capitalize">
					{event.requires}
				</span>
			</p>
		{/if}
	</div>
	<form {...FormKit.remote(registerEvent)} class="mt-2 flex items-center gap-2 sm:mt-0">
		<input type="hidden" name="eventID" value={event.id} />
		<Button type="submit" disabled={disabled}>
			{#if event.eventId}
				Resume
			{:else}
				Join
			{/if}
		</Button>
	</form>
</li>
