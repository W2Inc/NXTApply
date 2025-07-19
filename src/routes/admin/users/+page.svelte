<script lang="ts">
	import type { ApplicationTrack, User } from '@prisma/client';
	import type { PageProps } from './$types';
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/input.svelte';
	import { Download, Search, Trash, Users, User as SingleUser } from '@lucide/svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { page } from '$app/state';
	import Table, { type ColumnDef } from '$lib/ui/table';
	import type { UserActionSchema } from './+page.server';
	import Form from '$lib/ui/form.svelte';
	import Dropdown from '$lib/ui/dropdown.svelte';

	const { data }: PageProps = $props();

	let search = $state('');

	// Always create params from the current URL, not from scratch
	const url = $derived.by(() => {
		const params = new URLSearchParams(page.url.search);
		if (search) {
			params.set('q', search);
		} else {
			params.delete('q');
		}
		return `${page.url.pathname}?${params.toString()}`;
	});


	const navigate = () => goto(url, { invalidate: ['admin:users'] });
	const columns: ColumnDef<User>[] = [
		{ key: 'id', label: 'Id' },
		{ key: 'email', label: 'Email' },
		{ key: 'firstName', label: 'First Name' },
		{ key: 'lastName', label: 'Last Name' },
		{ key: 'verified', label: 'Verified', type: 'bool' },
		{ key: 'country', label: 'Country' },
		{ key: 'dob', label: 'Date of Birth', type: 'years' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-primary mb-8 text-3xl font-bold">Users</h1>
	<div class="flex items-center gap-2">
		<Input type="text" icon={Search} bind:value={search} placeholder="Search by email, name, ..." />
		<Button class="gap-2" onclick={navigate}>
			<Search size={16} />
			Search
		</Button>
		<hr class="flex-1 border-l" />
		<Dropdown>
			{#snippet trigger()}
				<Download size={16} />
			{/snippet}
			<div class="w-[200px]">
				<Button variant="ghost" class="gap-2 w-full justify-start rounded-none">
					<SingleUser size={16} />
					Export Page to CSV
				</Button>
				<Button variant="ghost" class="gap-2 w-full justify-start rounded-none">
					<Users size={16} />
					Export All to CSV
				</Button>
			</div>
		</Dropdown>
	</div>
	<hr class="my-2" />
	<Table data={data.users} {columns}>
		{#snippet action(user)}
			<Form
				type={{} as UserActionSchema}
				beforeSubmit={() => confirm('Are you sure you want to delete this user?')}
			>
				{#snippet child({ errors })}
					<input type="hidden" name="id" value={user.id} />
					<Button type="submit" variant="icon">
						<Trash size={16} />
					</Button>
				{/snippet}
			</Form>
		{/snippet}
	</Table>
</div>
