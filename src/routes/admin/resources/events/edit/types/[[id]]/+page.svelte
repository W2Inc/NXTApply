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
	import FormEntry from '$lib/ui/form/form-entry.svelte';
	import Fieldset from '$lib/ui/track/fieldset.svelte';

	let search = $state();

	const { data }: PageProps = $props();
</script>

<div class="mx-auto max-w-xl">
	<h2 class="text-primary mb-2 text-xl font-bold">{data.type ? 'Edit' : 'Create'} Event Type</h2>
	<Form class="space-y-4">
		{#snippet fields(out)}
			{@const form = out as FormOutput}
			<Fieldset title="Settings">
				<FormEntry
					required
					type="text"
					name="name"
					placeholder="Open day, Piscine, ..."
					description="The event type name used to display the name"
					label="Name"
					value={data.type?.name}
					errors={form.errors.name}
				/>

				<FormEntry
					type="textarea"
					name="description"
					label="Description"
					description="A optional description to note what this type is for"
					value={data.type?.description}
					errors={form.errors.description}
				/>
			</Fieldset>

			<hr />
			<div class="flex items-center gap-4">
				<Button type="reset" variant="outline" class="gap-1">
					Reset
					<RefreshCcw size={18} />
				</Button>
				<hr class="flex-1 border-0" />
				<Button type="button" variant="outline" onclick={() => history.back()}>Cancel</Button>
				<Button type="submit" class="gap-1">
					<span>Save</span>
					<Save size={18} />
				</Button>
			</div>
		{/snippet}
	</Form>
</div>
