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

	const { data }: PageProps = $props();
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

<Table data={data.users} {columns}>
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
