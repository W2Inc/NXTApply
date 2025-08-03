<script lang="ts">
	import type { ColumnDef } from '$lib/ui/table';
	import type { PageProps } from './$types';
	import type { ApplicationEvent } from '@prisma/client';

	import { page } from '$app/state';
	import { Badge, BadgeCent, Pen, Plane, PlaneLanding, Plus, RefreshCcw, Save, Trash } from '@lucide/svelte';
	import Table from '$lib/ui/table';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { UserResult } from './+page.server';
	import Card from '$lib/ui/card.svelte';

	const { data }: PageProps = $props();
	const eventColumns: ColumnDef<UserResult>[] = [
		{ key: 'firstName', label: 'First Name' },
		{ key: 'lastName', label: 'Last Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'verified', label: 'Verified', type: 'bool' },
		{ key: 'dob', label: 'DOB', type: 'years' },
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

{#if data.stats}
	<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
		<Card>
			<div class="flex flex-col items-center">
				<span class="text-2xl font-bold">{data.stats.userCount}</span>
				<span class="text-gray-500">Total Users</span>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col items-center">
				<span class="text-2xl font-bold">{data.stats.activeUsers}</span>
				<span class="text-gray-500">Active Users</span>
			</div>
		</Card>
		<Card>
			<div class="flex flex-col items-center">
				<span class="text-2xl font-bold">{data.stats.averageAge?.toFixed(1)}</span>
				<span class="text-gray-500">Average Age</span>
			</div>
		</Card>
	</div>
{/if}

<div class="mb-2 flex items-center gap-1">
	<Button class="gap-2" variant="outline" href="users/boarding">
		<Plane size={16} />
		Onboard User
	</Button>
</div>


<Table
	data={data.users}
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
