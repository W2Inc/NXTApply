<script lang="ts">
	import type { PageProps } from './$types';

	import { page } from '$app/state';
	import {
		Badge,
		BadgeCent,
		Pen,
		Plane,
		PlaneLanding,
		Plus,
		RefreshCcw,
		Save,
		Trash
	} from '@lucide/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { UserResult } from './+page.server';
	import type { ColumnDef } from '$lib/components/table';
	import { Button } from '$lib/components/ui/button';
	import Table from '$lib/components/table';

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
		const urlPage = Number(page.url.searchParams.get('page'));
		return isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
	});

	function setQuery(key: string, value: number) {
		page.url.searchParams.set(key, value.toString());
		goto(page.url, { invalidateAll: true });
	}
</script>

{#if data.stats}
	<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class="rounded border p-4">
			<div class="flex flex-col items-center">
				<span class="text-2xl font-bold">{data.stats.userCount}</span>
				<span class="text-gray-500">Total Users</span>
			</div>
		</div>
		<div class="rounded border p-4">
			<div class="flex flex-col items-center">
				<span class="text-2xl font-bold">{data.stats.activeUsers}</span>
				<span class="text-gray-500">Active Users</span>
			</div>
		</div>
		<div class="rounded border p-4">
			<div class="flex flex-col items-center">
				<span class="text-2xl font-bold">{data.stats.averageAge?.toFixed(1)}</span>
				<span class="text-gray-500">Average Age</span>
			</div>
		</div>
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
	{#snippet action(user)}
		<form class="flex justify-end">
			<input type="hidden" name="id" value={user.id} />
			<Button title="Edit" type="button" size="icon" variant="ghost" href="users/manage/{user.id}">
				<Pen size={16} />
			</Button>
			<!-- <Button title="Delete" type="submit" size="icon" variant="ghost" formaction="?/remove">
				<Trash size={16} />
			</Button> -->
		</form>
	{/snippet}
</Table>
