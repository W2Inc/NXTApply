<script lang="ts">
	import type { ColumnDef } from '$lib/ui/table';
	import type { PageProps } from './$types';
	import type { ApplicationEvent } from '@prisma/client';

	import { page } from '$app/state';
	import { Pen, Plus, RefreshCcw, Save, Trash } from '@lucide/svelte';
	import Table from '$lib/ui/table';
	import Form from '$lib/ui/form/form.svelte';
	import Button from '$lib/ui/button.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { FormOutput } from './+page.server';
	import Fieldset from '$lib/ui/track/fieldset.svelte';
	import FormEntry from '$lib/ui/form/form-entry.svelte';
	import { fromDateToInput } from '$lib/index.svelte';

	const { data }: PageProps = $props();
	let disabled = $derived(data.event !== null);
	let enableRegisteCutoff = $state(true);
	const eventTypeOptions = $derived(
		data.types.map((type) => ({
			label: type.name,
			value: type.id
		}))
	);

	const dependencies = $derived(
		data.types
			.map((type) => ({
				label: type.name,
				value: type.id
			}))
	);

	function setQuery(key: string, value: number) {
		page.url.searchParams.set(key, value.toString());
		goto(page.url, { invalidateAll: true });
	}
</script>

<Form class="mx-auto max-w-xl space-y-2">
	{#snippet fields(out)}
		{@const form = out as FormOutput}

		<Fieldset title="Settings">
			<FormEntry
				required
				type="select"
				name="eventTypeId"
				label="Event type"
				{disabled}
				description="Select the type of event."
				errors={form.errors.eventTypeId}
				value={data.event?.eventTypeId}
			>
				{#each eventTypeOptions as opt}
					<option value={opt.value} selected={data.event?.eventTypeId === opt.value}>
						{opt.label}
					</option>
				{/each}
			</FormEntry>

			<FormEntry
				type="select"
				name="dependencies"
				label="Prerequisite Event Type"
				description="User must have completed a given event type before this one."
				errors={form.errors.dependencies}
				value={data.dependencies.at(0) ?? ''}
			>
				<option value="">None</option>
				{#each eventTypeOptions as opt}
					<option value={opt.value} selected={data.event?.eventTypeId === opt.value}>
						{opt.label}
					</option>
				{/each}
			</FormEntry>

			<FormEntry
				required
				type="datetime-local"
				name="startsAt"
				label="Start Date & Time"
				description="When does this event start?"
				errors={form.errors.startsAt}
				value={fromDateToInput(page.data.tz, data.event?.startsAt)}
			/>

			<hr />

			<FormEntry
				required
				type="number"
				name="maxUsers"
				placeholder="256"
				min="0"
				description="The maximum amount of applicants for this event"
				label="Max Users"
			/>
		</Fieldset>

		<Fieldset title="Registration Cutoff">
			<div class="text-muted-foreground flex w-full items-center gap-2 text-xs">
				<FormEntry {disabled} type="checkbox" bind:checked={enableRegisteCutoff} />
				<span>Enable</span>
			</div>

			{#if enableRegisteCutoff}
				<FormEntry
					type="datetime-local"
					name="registerUntil"
					label="Register Until"
					description="Cutoff for registration. Leave blank for no limit."
					errors={form.errors.registerUntil}
					value={data.event?.registerUntil}
				/>
			{/if}
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
