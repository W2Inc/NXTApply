<script lang="ts">
	import type { ColumnDef } from '$lib/ui/table';
	import type { PageProps } from './$types';
	import type { ApplicationEvent } from '@prisma/client';

	import { page } from '$app/state';
	import { Pen, Plus, Trash } from '@lucide/svelte';
	import Table from '$lib/ui/table';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	const { data }: PageProps = $props();
	const eventColumns: ColumnDef<ApplicationEvent>[] = [
		{ key: 'id', label: 'Id' },
		{ key: 'startsAt', label: 'Starts at', type: 'date' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];

	let eventsPage = $derived.by(() => {
		const urlPage = Number(page.url.searchParams.get('p1'));
		return isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
	});

	function setPage(key: string, value: number) {
		const url = new URL(page.url);
		url.searchParams.set(key, value.toString());
		goto(url.toString(), { invalidateAll: true });
	}
</script>

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
