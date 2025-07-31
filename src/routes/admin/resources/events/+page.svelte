<script lang="ts">
	import type { ColumnDef } from '$lib/ui/table';
	import type { PageProps } from './$types';

	import { page } from '$app/state';
	import { Pen, Plus, RefreshCcw, Save, Trash } from '@lucide/svelte';
	import Table from '$lib/ui/table';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { EventResult } from './+page.server';

	const { data }: PageProps = $props();
	const eventColumns: ColumnDef<EventResult>[] = [
		{ key: 'typeName', label: 'Type' },
		{ key: 'userCount', label: 'Users' },
		{ key: 'startsAt', label: 'Starts at', type: 'date' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];

	let eventsPage = $derived.by(() => {
		const urlPage = Number(page.url.searchParams.get('p1'));
		return isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
	});

	function setQuery(key: string, value: number) {
		page.url.searchParams.set(key, value.toString());
		goto(page.url, { invalidateAll: true });
	}
</script>

<h3 class="text-md mb-2 font-semibold">Events</h3>
<div class="mb-2 flex items-center gap-1">
	<Button class="gap-2" variant="outline" href="events/edit">
		<Plus size={16} />
		Create
	</Button>
	<Button class="gap-2" onclick={() => setQuery('page', Math.random())} variant="outline">
		<Plus size={16} />
		Test
	</Button>
</div>

<Table
	data={data.events}
	columns={eventColumns}
	onnext={() => setQuery('page', eventsPage + 1)}
	onprev={() => setQuery('page', eventsPage - 1)}
>
	{#snippet action(event)}
		<Form
			class="flex justify-end"
			before={() => confirm('Are you sure you?')}
			after={() => invalidateAll()}
		>
			{#snippet fields(out)}
				<input type="hidden" name="id" value={event.id} />
				<Button
					disabled={out.loading}
					title="Edit"
					type="button"
					variant="icon"
					href="events/edit/{event.id}"
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
