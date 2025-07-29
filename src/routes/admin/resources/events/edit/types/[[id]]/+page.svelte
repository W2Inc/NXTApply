<script lang="ts">
	import type { ColumnDef } from '$lib/ui/table';
	import type { ApplicationEvent, EventType } from '@prisma/client';
	import { goto, invalidateAll } from '$app/navigation';
	import Table from '$lib/ui/table';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import { Pen, Plus, RefreshCcw, Save, Search, Trash } from '@lucide/svelte';
	import Documentation from '$lib/ui/track/documentation.svelte';
	import Input from '$lib/ui/input.svelte';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { FormOutput } from './+page.server';
	import Entry from '$lib/ui/form/entry.svelte';
	import Textarea from '$lib/ui/textarea.svelte';
	import type { PageProps } from './$types';
	import Card from '$lib/ui/card.svelte';

	let search = $state();

	const { data }: PageProps = $props();
</script>

<Card class="mx-auto max-w-xl">
	<h2 class="text-primary mb-6 text-2xl font-bold">{data.type ? 'Edit' : 'Create'} Event Type</h2>
	<Form class="space-y-4">
		{#snippet fields(out)}
			{@const form = out as FormOutput}
			<Entry
				name="name"
				label="Name"
				errors={form.errors.name}
				description="The name of the event. This will be visible to users."
			>
				{#snippet child(props)}
					<Input
						required
						placeholder="Enter event name"
						type="text"
						value={data.type?.name ?? ''}
						{...props}
					/>
				{/snippet}
			</Entry>

			<Entry
				name="description"
				label="Description"
				errors={form.errors.description}
				description="Optional description of the event type."
			>
				{#snippet child(props)}
					<Textarea
						rows={10}
						placeholder="Enter event description"
						value={data.type?.description ?? ''}
						{...props}
					/>
				{/snippet}
			</Entry>
			<div class="flex items-center gap-4">
				<Button type="reset" variant="outline" class="gap-1">
					Reset
					<RefreshCcw size={18} />
				</Button>
				<hr class="flex-1" />
				<Button type="button" variant="outline" onclick={() => history.back()}>Cancel</Button>
				<Button type="submit" class="gap-1">
					<span>Save</span>
					<Save size={18} />
				</Button>
			</div>
		{/snippet}
	</Form>
</Card>
