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
	import { tutorial } from './tutorial.svelte';
	import { leave } from '@/remotes/event/leave.remote';

	const { data }: PageProps = $props();
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
			<PartyPopper size={22} class="shrink-0 text-primary" />
			<h2 class="text-xl font-semibold tracking-tight">Upcoming Events</h2>
			<Tooltip.Root>
				<Tooltip.Trigger class="ml-auto">
					<span class="hidden text-xs text-muted-foreground sm:inline">
						<span class="hidden md:inline">Timezone:</span>
						<Badge>{page.data.tz}</Badge>
					</span>
				</Tooltip.Trigger>
				<Tooltip.Content>All events take place in the following timezone.</Tooltip.Content>
			</Tooltip.Root>
			{#await data.events then events}
				<Tooltip.Root>
					<Tooltip.Trigger
						onclick={() => events.length > 0 ? tutorial().noEventTutorial.drive() : tutorial().noEventTutorial.drive()}
						class={buttonVariants({ variant: 'outline', size: 'icon' })}
					>
						<BadgeQuestionMark />
					</Tooltip.Trigger>
					<Tooltip.Content>Lost? Click here to get some help.</Tooltip.Content>
				</Tooltip.Root>
			{/await}
		</div>
		<ul class="space-y-4">
			{#await data.events}
				<li class="flex flex-col items-center justify-center py-8">
					<LoaderCircle class="mb-2 animate-spin text-primary" size={32} />
					<span class="text-base text-muted-foreground">Loading upcoming events...</span>
				</li>
			{:then events}
				{#each events as event}
					{@const joinForm = join.for(event.id)}
					{@const leaveForm = leave.for(event.id)}
					<Event {event} join={joinForm} leave={leaveForm} />
				{/each}
				{#if !events?.length}
					<li class="py-8 text-center text-base text-muted-foreground">No upcoming events.</li>
				{/if}
			{/await}
		</ul>
	</div>
</div>
