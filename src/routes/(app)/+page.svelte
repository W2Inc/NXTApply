<script lang="ts">
	import { Calendar, CircleAlert, ExternalLink, Map, MapPin } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { cn, dateFormatOptions } from '$lib/index.svelte';
	import Button from '$lib/ui/button.svelte';
	import { page } from '$app/state';
	import { DateFormatter, fromDate, getLocalTimeZone, now } from '@internationalized/date';
	import { joinEvent } from '$lib/remotes/event.remote';
	import Event from './event.svelte';

	const { data }: PageProps = $props();

	// function toICS(startsAt: Date, name: string, description: string | null, address: string | null) {
	// 	const start = fromDate(new Date(startsAt), page.data.tz);
	// 	const end = start.add({ hours: 1 });
	// 	const ics = `
	// 		BEGIN:VCALENDAR
	// 		VERSION:2.0
	// 		BEGIN:VEVENT
	// 		SUMMARY:${name}
	// 		DTSTART:${start
	// 			.toAbsoluteString()
	// 			.replace(/[-:]/g, '')
	// 			.replace(/\.\d+Z$/, 'Z')}
	// 		DTEND:${end
	// 			.toAbsoluteString()
	// 			.replace(/[-:]/g, '')
	// 			.replace(/\.\d+Z$/, 'Z')}
	// 		${address ? `LOCATION:${address}` : ''}
	// 		DESCRIPTION:${description ?? ''}
	// 		END:VEVENT
	// 		END:VCALENDAR
	// 	`.trim();

	// 	return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
	// }
</script>

<div class="space-y-8 pt-4">
	<div class="bg-card border-border mb-6 flex flex-col gap-2 rounded-xl border px-8 py-7 shadow-lg">
		<h1 class="text-primary font-sans text-3xl font-extrabold tracking-tight">
			Welcome to NXTApply!
		</h1>
		<p class="text-muted-foreground mt-1 text-lg">
			Your student application journey starts here.<br />
			<span class="text-base">Follow the steps below to complete your application.</span>
		</p>
	</div>

	<!-- Events List -->
	<div class="bg-card border-border rounded-xl border px-6 py-6 shadow-md">
		<div class="mb-5 flex items-center gap-2">
			<Calendar size={22} class="text-primary" />
			<h2 class="text-xl font-semibold tracking-tight">Upcoming Events</h2>
		</div>
		<ul class="divide-border divide-y">
			{#each data.events as event, i}
				<Event {event} />
			{/each}
			{#if !data.events?.length}
				<li class="text-muted-foreground py-8 text-center text-base">No upcoming events.</li>
			{/if}
		</ul>
	</div>
</div>
