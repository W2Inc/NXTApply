<script lang="ts">
	import { Calendar, CircleAlert, ExternalLink, Map, MapPin } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { cn, dateFormatOptions } from '$lib/index.svelte';
	import Button from '$lib/ui/button.svelte';
	import { page } from '$app/state';
	import { DateFormatter, fromDate, getLocalTimeZone, now } from '@internationalized/date';

	const { data }: PageProps = $props();
	export const formatter = new DateFormatter(page.data.locale, dateFormatOptions);

	function toICS(startsAt: Date, name: string, description: string | null, address: string | null) {
		const start = fromDate(new Date(startsAt), page.data.tz);
		const end = start.add({ hours: 1 });
		const ics = `
			BEGIN:VCALENDAR
			VERSION:2.0
			BEGIN:VEVENT
			SUMMARY:${name}
			DTSTART:${start
				.toAbsoluteString()
				.replace(/[-:]/g, '')
				.replace(/\.\d+Z$/, 'Z')}
			DTEND:${end
				.toAbsoluteString()
				.replace(/[-:]/g, '')
				.replace(/\.\d+Z$/, 'Z')}
			${address ? `LOCATION:${address}` : ''}
			DESCRIPTION:${description ?? ''}
			END:VEVENT
			END:VCALENDAR
		`.trim();

		return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
	}
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
				{@const registerUntil = fromDate(new Date(event.registerUntil ?? event.startsAt), page.data.tz)}
				{@const starts = fromDate(new Date(event.startsAt), page.data.tz)}
				{@const expired = now(page.data.tz).compare(registerUntil) > 0}
				{@const isDisabled = expired || event.requires !== null}
				<li class="flex flex-col gap-4 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
					<div class="flex-shrink-0 self-start">
						<div
							class="bg-muted text-primary border-border flex h-12 w-12 items-center justify-center rounded-lg border shadow-sm"
						>
							<Calendar size={22} />
						</div>
					</div>
					<div class="min-w-0 flex-1">
						<p
							class={cn(
								'text-foreground text-lg font-semibold',
								expired && 'line-through opacity-50'
							)}
						>
							{event.name}
						</p>
						<!-- <p class="text-foreground text-xs">{event.description}</p> -->
						<div class="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
							<span
								class={cn('inline-flex items-center gap-1', expired && 'line-through opacity-50')}
							>
								<Calendar size={16} class="inline-block" />
								<a
									inert={expired}
									href={toICS(event.startsAt, event.name, event.description, event.address)}
									download={`${event.name}.ics`}
									class="hover:text-primary text-xs underline"
									title="Save to calendar"
								>
									{formatter.format(starts.toDate())}
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
					<div class="mt-2 flex items-center gap-2 sm:mt-0">
						<Button disabled={isDisabled}>Join</Button>
					</div>
				</li>
			{/each}
			{#if !data.events?.length}
				<li class="text-muted-foreground py-8 text-center text-base">No upcoming events.</li>
			{/if}
		</ul>
	</div>

	<!-- <div class="bg-card p-6 rounded-lg shadow-sm border border-border">
		<h2 class="text-lg font-semibold mb-4">Your Next Steps</h2>
		<ol class="space-y-5">
			{#each steps as step}
				<li class="flex items-start gap-4">
					<div class="mt-1">
						<step.icon size={24} class={statusColors[step.status]} />
					</div>
					<div>
						<p class="font-medium">{step.title}</p>
						<p class="text-sm text-muted-foreground">{step.description}</p>
						{#if step.status === 'completed'}
							<span class="text-xs text-green-600 font-semibold">Completed</span>
						{:else if step.status === 'pending'}
							<span class="text-xs text-amber-600 font-semibold">Pending</span>
						{:else}
							<span class="text-xs text-blue-600 font-semibold">Upcoming</span>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	</div>

	<div class="bg-card p-6 rounded-lg shadow-sm border border-border">
		<div class="flex items-center gap-2 mb-4">
			<Calendar size={20} class="text-primary" />
			<h2 class="text-lg font-semibold">Upcoming Events</h2>
		</div>
		<ul class="space-y-4">
			{#each events as event}
				<li class="flex items-center gap-4">
					<div class="h-10 w-10 bg-muted rounded-md flex items-center justify-center text-primary">
						<Calendar size={18} />
					</div>
					<div>
						<p class="font-medium">{event.title}</p>
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							<span>{event.date}</span>
							<span>•</span>
							<span>{event.location}</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div> -->
</div>
