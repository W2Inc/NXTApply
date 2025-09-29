<script lang="ts">
	import type { PageProps } from './$types';

	import { page } from '$app/state';
	import { LoaderCircle, PartyPopper, Pen, Plane, Type } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { ColumnDef } from '$lib/components/table';
	import { Button } from '$lib/components/ui/button';
	import Table from '$lib/components/table';
	import type { ApplicationTrack } from '@prisma/client';
	import type { ISO } from '$lib/utils';

	const { data }: PageProps = $props();
	const eventColumns: ColumnDef<ISO<ApplicationTrack>>[] = [
		{ key: 'name', label: 'Name' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];

	let eventsPage = $derived.by(() => {
		const urlPage = Number(page.url.searchParams.get('page'));
		return isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
	});

	function setQuery(key: string, value: number) {
		page.url.searchParams.set(key, value.toString());
		goto(page.url, { invalidateAll: true });
	}
</script>

<div class="mb-2 flex items-center gap-1">
	<Button class="gap-2" variant="outline" href="event/manage">
		<PartyPopper size={16} />
		Create Event
	</Button>
	<Button class="gap-2" variant="outline" href="event/manage">
		<Type size={16} />
		Create Event Type
	</Button>
</div>

{#await data.events}
	<LoaderCircle class="animate-spin" />
{:then events}
	<Table
		data={events}
		columns={eventColumns}
		onnext={() => setQuery('page', eventsPage + 1)}
		onprev={() => setQuery('page', eventsPage - 1)}
	>
		{#snippet action(event)}
			<form class="flex justify-end">
				<input type="hidden" name="id" value={event.id} />
				<Button
					title="Edit"
					type="button"
					size="icon"
					variant="ghost"
					href="event/manage/{event.id}"
				>
					<Pen size={16} />
				</Button>
			</form>
		{/snippet}
	</Table>
{/await}
