<script lang="ts">
	import type { ColumnDef } from '$lib/ui/table';
	import type { ApplicationEvent, EventType } from '@prisma/client';
	import type { PageProps } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import Table from '$lib/ui/table';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import { Pen, Plus, Search, Trash } from '@lucide/svelte';
	import Documentation from '$lib/ui/track/documentation.svelte';
	import Input from '$lib/ui/input.svelte';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let search = $state();

	const { data }: PageProps = $props();
	const eventColumns: ColumnDef<ApplicationEvent>[] = [
		{ key: 'id', label: 'Id' },
		{ key: 'startsAt', label: 'Starts at', type: 'date' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];

	const eventTypeColumns: ColumnDef<EventType>[] = [
		// { key: 'id', label: 'Id' },
		{ key: 'name', label: 'Name' },
		{ key: 'description', label: 'Description' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];

	let eventsPage = $derived.by(() => {
		const urlPage = Number(page.url.searchParams.get('p1'));
		return isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
	});

	let typesPage = $derived.by(() => {
		const urlPage = Number(page.url.searchParams.get('p2'));
		return isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
	});

	function setPage(key: string, value: number) {
		const url = new URL(page.url);
		url.searchParams.set(key, value.toString());
		goto(url.toString(), { invalidateAll: true });
	}
</script>

<Documentation>
	<h2 class="mb-2 text-lg font-semibold">Events vs Event Types</h2>
	<p class="mb-2">
		<strong>Event Types</strong> define the <span class="font-medium">category or template</span> for
		events. For example, "Interview", "Workshop", or "Onboarding Session". Each type has a name and description,
		and can be reused for multiple events.
	</p>
	<p>
		<strong>Events</strong> are <span class="font-medium">specific scheduled instances</span> of an event
		type. For example, "Onboarding Session on July 10th, 2024". Events reference an event type, have
		a start date, and may have additional details like address or registration deadline.
	</p>
</Documentation>

<hr class="my-2"/>

<!-- Events Section -->
<div>
	<h3 class="text-md mb-2 font-semibold">Events</h3>
	<div class="mb-2 flex items-center gap-1">
		<!-- <Input type="text" icon={Search} bind:value={search} placeholder="Search event types..." />
		<Button class="gap-2" href="?q={search}">
			<Search size={16} />
			Search
		</Button> -->
		<Button class="gap-2" href="events/edit/base" variant="outline">
			<Plus size={16} />
			Create
		</Button>
	</div>
	<Table
		data={data.events}
		columns={eventColumns}
		onnext={() => setPage('p1', eventsPage + 1)}
		onprev={() => setPage('p1', eventsPage - 1)}
	>
		{#snippet action(event)}
			<Form class="flex justify-end" after={() => invalidateAll()}>
				{#snippet fields(out)}
					<input type="hidden" name="id" value={event.id} />
					<Button
						disabled={out.loading}
						title="Edit"
						type="button"
						variant="icon"
						href="events/edit/base/{event.id}"
					>
						<Pen size={16} />
					</Button>
					<Button
						disabled={out.loading}
						title="Delete"
						type="submit"
						variant="icon"
						formaction="?/remove"
					>
						<Trash size={16} />
					</Button>
				{/snippet}
			</Form>
		{/snippet}
	</Table>
</div>

<hr class="my-4" />

<!-- Event Types Section -->
<div>
	<h3 class="text-md mb-2 font-semibold">Event Types</h3>
	<div class="mb-2 flex items-center gap-1">
		<!-- <Input type="text" icon={Search} bind:value={search} placeholder="Search event types..." />
		<Button class="gap-2" href="?q={search}">
			<Search size={16} />
			Search
		</Button> -->
		<Button class="gap-2" href="events/edit/types" variant="outline">
			<Plus size={16} />
			Create
		</Button>
	</div>
	<Table
		data={data.types}
		columns={eventTypeColumns}
		onnext={() => setPage('p2', typesPage + 1)}
		onprev={() => setPage('p2', typesPage - 1)}
	>
		{#snippet action(track)}
			<Form class="flex justify-end" after={() => invalidateAll()}>
				{#snippet fields(out)}
					<input type="hidden" name="id" value={track.id} />
					<Button
						disabled={out.loading}
						title="Edit"
						type="button"
						variant="icon"
						href="events/edit/types/{track.id}"
					>
						<Pen size={16} />
					</Button>
					<Button
						disabled={out.loading}
						title="Delete"
						type="submit"
						variant="icon"
						formaction="?/remove"
					>
						<Trash size={16} />
					</Button>
				{/snippet}
			</Form>
		{/snippet}
	</Table>
</div>
