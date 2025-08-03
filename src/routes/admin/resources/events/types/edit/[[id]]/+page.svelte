<script lang="ts">
	import type { PageProps } from './$types';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import Fieldset from '$lib/ui/track/fieldset.svelte';
	import FormEntry from '$lib/ui/form/form-entry.svelte';
	import { Save, RefreshCcw } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { FormOutput } from './+page.server';

	const { data }: PageProps = $props();
</script>

<Form class="mx-auto max-w-xl space-y-4">
	{#snippet fields(out)}
		{@const form = out as FormOutput}

		<Fieldset title="Event Type Details">
			<FormEntry required name="name" label="Name" value={data.type?.name} errors={form.errors.name} />
			<FormEntry
				name="description"
				label="Description"
				type="textarea"
				value={data.type?.description}
				errors={form.errors.description}
			/>
		</Fieldset>

		<div class="flex items-center gap-4">
			<Button type="reset" variant="outline" class="gap-1">
				Reset
				<RefreshCcw size={18} />
			</Button>
			<hr class="flex-1 border" />
			<Button type="button" variant="outline" onclick={() => history.back()}>Cancel</Button>
			<Button type="submit" class="gap-1">
				<span>Save</span>
				<Save size={18} />
			</Button>
		</div>
	{/snippet}
</Form>
