<script lang="ts">
	import type { PageProps } from './$types';

	import { page } from '$app/state';
	import {
		Badge,
		BadgeCent,
		LoaderCircle,
		Pen,
		Plane,
		PlaneLanding,
		Plus,
		RefreshCcw,
		Save,
		Trash
	} from '@lucide/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { ColumnDef } from '$lib/components/table';
	import { Button } from '$lib/components/ui/button';
	import Table from '$lib/components/table';
	import type { User } from '@prisma/client';

	const { data }: PageProps = $props();
	const eventColumns: ColumnDef<User>[] = [
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

<div class="mb-2 flex items-center gap-1">
	<Button class="gap-2" variant="outline" href="user/boarding">
		<Plane size={16} />
		Onboard User
	</Button>
</div>

{#await data.users}
	<LoaderCircle class="animate-spin" />
{:then users}
	<Table
		data={users}
		columns={eventColumns}
		onnext={() => setQuery('page', eventsPage + 1)}
		onprev={() => setQuery('page', eventsPage - 1)}
	>
		{#snippet action(user)}
			<form class="flex justify-end">
				<input type="hidden" name="id" value={user.id} />
				<Button
					title="Edit"
					type="button"
					size="icon"
					variant="ghost"
					href="user/manage/{user.id}"
				>
					<Pen size={16} />
				</Button>
				<!-- <Button title="Delete" type="submit" size="icon" variant="ghost" formaction="?/remove">
				<Trash size={16} />
			</Button> -->
			</form>
		{/snippet}
	</Table>
{/await}
