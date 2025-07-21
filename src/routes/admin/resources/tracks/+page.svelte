<script lang="ts">
	import type { ApplicationTrack } from '@prisma/client';
	import type { PageProps } from './$types';
	import Dialog from '$lib/ui/dialog.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/input.svelte';
	import { page } from '$app/state';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { Check, Ellipsis, Pen, Plus, Search, Trash } from '@lucide/svelte';
	import Dropdown from '$lib/ui/dropdown.svelte';
	import Table, { type ColumnDef } from '$lib/ui/table';

	const { data }: PageProps = $props();
	const columns: ColumnDef<ApplicationTrack>[] = [
		{ key: 'id', label: 'Id' },
		{ key: 'name', label: 'Name' },
		{ key: 'isActive', label: 'Active', type: 'bool' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];
</script>

<Table data={data.tracks} {columns}>
	{#snippet action(track)}
		<Form class="flex justify-end" after={() => invalidateAll()}>
			{#snippet fields(out)}
				{JSON.stringify(out)}
				<input type="hidden" name="id" value={track.id} />
				<Button
					disabled={out.loading}
					title="Edit"
					type="submit"
					variant="icon"
					formaction="?/activate"
				>
					<Pen size={16} />
				</Button>
				<Button
					title="Set as Active"
					disabled={track.isActive || out.loading}
					type="submit"
					variant="icon"
					formaction="?/activate"
				>
					<Check size={16} />
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
