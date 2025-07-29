<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Card from '$lib/ui/card.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import { ArrowUpCircle, Check, CircleArrowDown, RefreshCcw, Save } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import type { FormOutput } from './+page.server';
	import Entry from '$lib/ui/form/entry.svelte';
	import Select from '$lib/ui/select.svelte';
	import Input from '$lib/ui/input.svelte';

	const { data }: PageProps = $props();

	const eventTypeOptions = $derived(
		data.eventTypes.map((type) => ({
			label: type.name,
			value: type.id
		}))
	);

	// Build select options for dependencies (exclude self if editing)
	const dependencyOptions = $derived(
		data.eventTypes
			.filter((type) => !data.event || type.id !== data.event.id)
			.map((type) => ({
				label: type.name,
				value: type.id
			}))
	);

	let enableRegisterUntil = $state(!!data.event?.registerUntil);
</script>

<Card class="bg-card border-border mx-auto max-w-xl border px-8 py-10 shadow-lg">
	<h2 class="text-primary mb-8 text-3xl font-extrabold tracking-tight">
		{data.event ? 'Edit' : 'Create'} Application Event
	</h2>
	<Form class="w-full space-y-2">
		{#snippet fields(out)}
			{@const form = out as FormOutput}

			<Entry
				name="eventTypeId"
				label="Event type"
				errors={form.errors.eventTypeId}
				description="Select the type of event."
			>
				{#snippet child(props)}
					<Select
						required
						{...props}
					>
						<optgroup label="Event Types">
							{#each eventTypeOptions as opt}
								<option value={opt.value} selected={data.event?.eventTypeId === opt.value}>
									{opt.label}
								</option>
							{/each}
						</optgroup>
					</Select>
				{/snippet}
			</Entry>

			<Entry
				name="dependencies"
				label="Prerequisite Event Types"
				description="User must have completed a given event type before this one."
				errors={form.errors.dependencies}
			>
				{#snippet child(props)}
					<Select {...props}>
						<option value="">None</option>
						{#each dependencyOptions as opt}
							<option
								value={opt.value}
								selected={data.event?.dependencies?.some((d) => d.requiredTypeId === opt.value)}
							>
								{opt.label}
							</option>
						{/each}
					</Select>
				{/snippet}
			</Entry>

			<Entry
				name="startsAt"
				label="Start Date & Time"
				errors={form.errors.startsAt}
				description="When does this event start?"
			>
				{#snippet child(props)}
					<Input
						required
						type="datetime-local"
						value={data.event?.startsAt ? data.event.startsAt.slice(0, 16) : ''}
						{...props}
					/>
				{/snippet}
			</Entry>

			<label class="text-muted-foreground text-xs">
				<Input type="checkbox" bind:checked={enableRegisterUntil} />
				Enable registration cutoff
			</label>

			{#if enableRegisterUntil}
				<Entry
					name="registerUntil"
					label="Register Until"
					errors={form.errors.registerUntil}
					description="Cutoff for registration. Leave blank for no limit."
				>
					{#snippet child(props)}
						<Input
							type="datetime-local"
							value={data.event?.registerUntil ? data.event.registerUntil.slice(0, 16) : ''}
							{...props}
						/>
					{/snippet}
				</Entry>
			{/if}

			<div class="mt-10 flex items-center gap-4">
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
