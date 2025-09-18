<script lang="ts">
	import { BadgeQuestionMark, LoaderCircle, PartyPopper, TriangleAlert } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Event from './event.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { page } from '$app/state';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	const { data }: PageProps = $props();
</script>

<div class="container mx-auto max-w-3xl p-8">
	<!-- Banner -->
	<div class="flex flex-col gap-2 rounded border bg-card px-8 py-7 shadow">
		<h1 class="font-sans text-3xl font-extrabold tracking-tight text-primary">
			{PUBLIC_APP_NAME}
		</h1>
		<p class="mt-1 text-lg text-muted-foreground">
			Below you can see your progress and active events.
		</p>
	</div>

	<Separator class="my-4" />

	<!-- Events -->
	<div class="rounded border bg-card px-6 py-6 shadow">
		<!-- Event:Header -->
		<div class="flex items-center gap-2">
			<PartyPopper size={22} class="shrink-0 text-primary" />
			<h2 class="text-xl w-full font-semibold tracking-tight flex justify-between">
				Upcoming Events
				<div class="flex items-center gap-2">
					<span class="hidden text-xs text-muted-foreground sm:inline">
						<span class="hidden md:inline">Timezone:</span>
						<Badge>{page.data.tz ?? 'Unknown'}</Badge>
					</span>
				</div>
			</h2>
		</div>

		<Separator class="my-4" />

		<!-- Event:Body -->
		<svelte:boundary>
			{#snippet pending()}
				<div class="flex flex-col items-center justify-center py-8">
					<LoaderCircle class="mb-2 animate-spin text-primary" size={32} />
					<span class="text-base text-muted-foreground">Loading upcoming events...</span>
				</div>
			{/snippet}

			{#snippet failed(reset)}
				<p class="text-center text-sm text-destructive animate-pulse">
					<TriangleAlert class="inline h-4 w-4 align-middle" />
					Failed to load events. Please try again.
				</p>
			{/snippet}

			<ul>
				{#each await data.events as event}
					<li><Event {event} /></li>
				{/each}
			</ul>
		</svelte:boundary>
	</div>
</div>

<!-- <div class="container mx-auto max-w-3xl p-8">
	<div class="flex flex-col gap-2 rounded-xl border bg-card px-8 py-7 shadow">
		<h1 class="font-sans text-3xl font-extrabold tracking-tight text-primary">
			Welcome to {PUBLIC_APP_NAME}!
		</h1>
		<p class="mt-1 text-lg text-muted-foreground">Your student application journey starts here.</p>
		<p class="text-base text-muted-foreground">
			Follow the steps below to complete your application.
		</p>
	</div>

	<Separator class="my-4" />

	<div class="rounded-xl border bg-card px-6 py-6 shadow">
		<div class="mb-5 flex items-center gap-2">
			<PartyPopper size={22} class="shrink-0 text-primary" />
			<h2 class="text-xl font-semibold tracking-tight">Upcoming Events</h2>
			<svelte:boundary>
				{#snippet pending()}
					<div class="ml-auto flex items-center gap-2">
						<LoaderCircle class="animate-spin text-primary" size={16} />
					</div>
				{/snippet}

				{@const eventLength = (await data.events).length}
				<Tooltip.Root>
					<Tooltip.Trigger class="ml-auto">
						<span class="hidden text-xs text-muted-foreground sm:inline">
							<span class="hidden md:inline">Timezone:</span>
							<Badge>{page.data.tz}</Badge>
						</span>
					</Tooltip.Trigger>
					<Tooltip.Content>All events take place in the following timezone.</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root>
					<Tooltip.Trigger
						onclick={() =>
							eventLength > 0
								? tutorial().noEventTutorial.drive()
								: tutorial().noEventTutorial.drive()}
						class={buttonVariants({ variant: 'outline', size: 'icon' })}
					>
						<BadgeQuestionMark />
					</Tooltip.Trigger>
					<Tooltip.Content>Lost? Click here to get some help.</Tooltip.Content>
				</Tooltip.Root>
			</svelte:boundary>
		</div>

		<svelte:boundary>
			{#snippet pending()}
				<div class="flex flex-col items-center justify-center py-8">
					<LoaderCircle class="mb-2 animate-spin text-primary" size={32} />
					<span class="text-base text-muted-foreground">Loading upcoming events...</span>
				</div>
			{/snippet}

			<ul class="space-y-4">
				{#each await data.events as event}
					Hello World
				{/each}
			</ul>
		</svelte:boundary>
	</div>
</div> -->
