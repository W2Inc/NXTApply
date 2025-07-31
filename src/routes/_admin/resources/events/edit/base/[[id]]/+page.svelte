<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Card from '$lib/ui/card.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import { RefreshCcw, Save } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import type { FormOutput } from './+page.server';
	import FormEntry from '$lib/ui/form/form-entry.svelte';
	import Select from '$lib/ui/select.svelte';
	import Input from '$lib/ui/input.svelte';
	import { fromDateToInput } from '$lib/index.svelte';
	import { page } from '$app/state';
	import Fieldset from '$lib/ui/track/fieldset.svelte';
	import Alert from '$lib/ui/alert.svelte';

	const { data }: PageProps = $props();

	const eventTypeOptions = $derived(
		data.eventTypes.map((type) => ({
			label: type.name,
			value: type.id
		}))
	);

	const dependencyOptions = $derived(
		data.eventTypes
			.filter((type) => !data.event || type.id !== data.event.id)
			.map((type) => ({
				label: type.name,
				value: type.id
			}))
	);

	let enableRegisterUntil = $state(!!data.event?.registerUntil);
	let disabled = $derived(true);
</script>

<div class="mx-auto max-w-xl space-y-2">
	<h2 class="text-primary mb-2 text-xl font-bold">
		{data.event ? 'Edit' : 'Create'} Application Event
	</h2>

	<Alert
		variant="warning"
		title="Managing Events"
		description="Once an event is created, only the maximum number of users can be changed. Other details cannot be edited because users may register immediately after creation, making it impossible to remove them from the event."
	/>

	<hr />

	<Form class="space-y-2">
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
					<optgroup label="Event Types">
						{#each eventTypeOptions as opt}
							<option value={opt.value}>
								{opt.label}
							</option>
						{/each}
					</optgroup>
				</FormEntry>

				<FormEntry
					type="select"
					{disabled}
					name="dependencies"
					label="Prerequisite Event Type"
					description="User must have completed a given event type before this one."
					errors={form.errors.dependencies}
					value={data.event?.dependencies?.[0]?.requiredTypeId ?? ''}
				>
					<option value="">None</option>
					{#each dependencyOptions as opt}
						<option
							value={opt.value}
							selected={data.event?.dependencies?.[0]?.requiredTypeId === opt.value}
						>
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
					<Input {disabled} type="checkbox" bind:checked={enableRegisterUntil} />
					<span>Enable</span>
				</div>

				{#if enableRegisterUntil}
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
</div>
