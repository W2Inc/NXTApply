<script lang="ts">
	import type { ApplicationTrack, User } from '@prisma/client';
	import type { PageProps } from './$types';
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/input.svelte';
	import {
		Download,
		Search,
		Trash,
		Users,
		User as SingleUser,
		Plus,
		Ellipsis,
		UserPlus,
		UserMinus
	} from '@lucide/svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { page } from '$app/state';
	import Table, { type ColumnDef } from '$lib/ui/table';
	import Dropdown from '$lib/ui/dropdown.svelte';
	import Form from '$lib/ui/form/form.svelte';


	let search = $state('');
	const { data }: PageProps = $props();

	let users = $derived.by(() => {
		const urlPage = Number(page.url.searchParams.get('page'));
		return isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
	});

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

	function setUrl(key: string, value: number | string) {
		const url = new URL(page.url);
		url.searchParams.set(key, value.toString());
		goto(url.toString(), { invalidateAll: true });
	}
</script>

<!-- <div class="flex items-center gap-2">
	<Input type="text" icon={Search} bind:value={search} placeholder="Search" />
	<Button class="gap-2" onclick={() => setUrl('q', search)}>
		<Search size={16} />
		Search
	</Button>
	<hr class="flex-1 border-l" />
</div>
<hr class="my-2" /> -->
<Table
	data={data.users}
	{columns}
	onnext={() => setUrl('page', users + 1)}
	onprev={() => setUrl('page', users - 1)}
>
	{#snippet action(user)}
		<Form
			before={() => confirm('Are you sure you want to continue ?')}
			after={() => invalidate('admin:users')}
		>
			{#snippet fields()}
				<input type="hidden" name="id" value={user.id} />
				<Button type="submit" variant="icon" formaction="?/remove">
					<Trash size={16} />
				</Button>
			{/snippet}
		</Form>
	{/snippet}
</Table>
