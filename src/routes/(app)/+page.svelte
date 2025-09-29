<script lang="ts">
	import { MessageCircleQuestion, LoaderCircle, PartyPopper, TriangleAlert, X, CircleQuestionMark } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { page } from '$app/state';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Event from '$lib/components/event/event.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { useEventTutorial } from '$lib/components/event/index.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	const { data }: PageProps = $props();
	const tutorial = useEventTutorial();
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
			<h2 class="flex w-full justify-between text-xl font-semibold tracking-tight">
				Upcoming Events
				<div class="flex items-center gap-2">
					<span class="hidden text-xs text-muted-foreground sm:inline">
						<span class="hidden md:inline">Timezone:</span>
						<Badge variant="secondary">{page.data.tz ?? 'Unknown'}</Badge>
					</span>
				</div>
			</h2>
			{#await data.events then events}
				<Tooltip.Root>
					<Tooltip.Trigger
						onclick={() => tutorial.drive(events.length)}
						class={buttonVariants({
							size: 'icon',
							variant: 'ghost',
							class: 'ml-auto size-6 text-foreground'
						})}
					>
						<CircleQuestionMark />
					</Tooltip.Trigger>
					<Tooltip.Content>Click here to get a small explanation</Tooltip.Content>
				</Tooltip.Root>
			{/await}
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
				<p class="animate-pulse text-center text-sm text-destructive">
					<TriangleAlert class="inline h-4 w-4 align-middle" />
					Failed to load events. Please try again.
				</p>
			{/snippet}

			{#await data.events then events}
				{#if events.length}
					<ul>
						{#each await data.events as event, i (event.id)}
							<li class="not-last:pb-4">
								<Event {event} />
							</li>
						{/each}
					</ul>
				{:else}
					<div class="flex flex-col items-center justify-center py-8 gap-3">
						<X class="mb-2 text-primary" size={32} />
						<span class="text-base text-muted-foreground text-center">
							<p>Currently there are no events!</p>
							<p>If you wait a bit, new ones might available.</p>
						</span>
					</div>
				{/if}
			{/await}
		</svelte:boundary>
	</div>
</div>
