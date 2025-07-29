<script lang="ts">
	import type { ColumnDef } from '$lib/ui/table';
	import type { ApplicationEvent } from '@prisma/client';
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import Table from '$lib/ui/table';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import { Pen, Trash } from '@lucide/svelte';

	const { data }: PageProps = $props();
	const columns: ColumnDef<ApplicationEvent>[] = [
		{ key: 'id', label: 'Id' },
		{ key: 'startsAt', label: 'Starts at', type: 'date' },
		{ key: 'createdAt', label: 'Created at', type: 'date' },
		{ key: 'updatedAt', label: 'Updated at', type: 'date' }
	];
</script>

<Table data={data.events} {columns}>
	{#snippet action(track)}
		<Form class="flex justify-end" after={() => invalidateAll()}>
			{#snippet fields(out)}
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
