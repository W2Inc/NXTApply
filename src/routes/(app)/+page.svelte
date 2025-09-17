<script lang="ts">
	import {
	BadgeQuestionMark,
		Calendar,
		CircleAlert,
		ExternalLink,
		Loader,
		LoaderCircle,
		Map,
		MapPin,
		PartyPopper
	} from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Event from './event.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { join } from '@/remotes/event/join.remote';
	import { page } from '$app/state';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { onMount } from 'svelte';
	import { driver } from 'driver.js';
	import { buttonVariants } from '$lib/components/ui/button';

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


		const driverObj = $derived(driver({
			showProgress: true,
			animate: true,
			steps: [
				{
					popover: {
						title: `Welcome to ${PUBLIC_APP_NAME}!`,
						description: 'In this tutorial, we will walk you through the event application process.'
					}
				},
				{
					element: '#event-action',
					popover: {
						title: 'Join an Event',
						description:
							'Click here to join the first available event and start your application journey.'
					}
				},
				{
					element: '#event-who',
					popover: {
						title: "Who's Registered?",
						description: 'See how many people have already registered for this event.'
					}
				},
				{
					element: '#event-when',
					popover: {
						title: 'Event Date & Time',
						description:
							'Check the scheduled date and time for this event. Make sure to mark your calendar!'
					}
				},
				{
					element: '#event-where',
					popover: {
						title: 'Event Location',
						description:
							'If the event is in-person, click here to view the location on the map. For digital events, this section may not appear.'
					}
				},
				{
					popover: {
						title: 'All Set!',
						description: "You're ready to get started. Good luck with your application!"
					}
				}
			]
		}));

</script>

<div class="container mx-auto max-w-3xl p-8">
	<div class="flex flex-col gap-2 rounded-xl border bg-card px-8 py-7 shadow">
		<h1 class="font-sans text-3xl font-extrabold tracking-tight text-primary">
			Welcome to {PUBLIC_APP_NAME}!
		</h1>
		<p class="mt-1 text-lg text-muted-foreground">Your student application journey starts here.</p>
		<p class="text-base text-muted-foreground">
			Follow the steps below to complete your application.
		</p>
	</div>

	<!-- Events List -->
	<Separator class="my-4" />

	<div class="rounded-xl border bg-card px-6 py-6 shadow">
		<div class="mb-5 flex items-center gap-2">
			<PartyPopper size={22} class="text-primary" />
			<h2 class="text-xl font-semibold tracking-tight">Upcoming Events</h2>
			<Tooltip.Root>
				<Tooltip.Trigger class="ml-auto">
					<span class="text-xs text-muted-foreground">
						Timezone:
						<Badge>{page.data.tz}</Badge>
					</span>
				</Tooltip.Trigger>
				<Tooltip.Content>All events take place in the following timezone.</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger onclick={() => driverObj.drive()} class={buttonVariants({ variant: 'outline', size: 'icon'})}>
					<BadgeQuestionMark />
				</Tooltip.Trigger>
				<Tooltip.Content>Lost? Click here to get some help.</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<ul class="space-y-4">
			{#await data.events}
				<li class="flex flex-col items-center justify-center py-8">
					<LoaderCircle class="mb-2 animate-spin text-primary" size={32} />
					<span class="text-base text-muted-foreground">Loading upcoming events...</span>
				</li>
			{:then events}
				{#each events as event}
					<Event {event} remote={join.for(event.id)} />
				{/each}
				{#if !events?.length}
					<li class="py-8 text-center text-base text-muted-foreground">No upcoming events.</li>
				{/if}
			{/await}
		</ul>
	</div>
</div>
