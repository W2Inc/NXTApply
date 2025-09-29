<script lang="ts">
	import Fieldset from '$lib/components/fieldset.svelte';
	import * as Form from '$lib/components/form';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { set as remote } from '@/remotes/event/set.remote';
	import type { PageProps } from './$types';
	import Label from '$lib/components/ui/label/label.svelte';
	import Datepicker from '$lib/components/datepicker.svelte';

	const { data }: PageProps = $props();

	// Toggle states for optional fields
	let showMaxUsers = $state(!!data.event?.maxUsers);
	let showRegisterUntil = $state(!!data.event?.registerUntil);
	let showTrackId = $state(!!data.event?.trackId);
</script>

<div class="mx-auto max-w-[40rem] py-4">
	<Form.Root {...remote} class="flex flex-col gap-3">
		<Fieldset title="Event Details" class="grid gap-2">
			<Form.Field id="event-address" label="Address" errors={remote.issues?.address}>
				<Input name={remote.field('address')} value={data.event?.address} />
			</Form.Field>

			<div class="mt-1 flex items-center gap-2 text-sm">
				<Checkbox id="toggle-maxUsers" bind:checked={showMaxUsers} class="h-4 w-4" />
				<Label for="toggle-maxUsers" class="cursor-pointer font-medium"
					>Set maximum users limit</Label
				>
			</div>

			{#if showMaxUsers}
				<div class="-mt-1 pl-6">
					<Form.Field
						id="event-maxUsers"
						class="flex-1"
						label="Maximum Users"
						errors={remote.issues?.maxUsers}
					>
						<Input
							type="number"
							name={remote.field('maxUsers')}
							value={data.event?.maxUsers}
							class="h-9"
						/>
					</Form.Field>
				</div>
			{/if}

			<div class="mt-1 grid grid-cols-2 gap-4">
				<Form.Field
					id="event-autoComplete"
					class="flex items-center gap-2"
					label="Auto Complete"
					errors={remote.issues?.autoComplete}
				>
					<Checkbox
						name={remote.field('autoComplete')}
						checked={data.event?.autoComplete ?? false}
						class="h-4 w-4"
					/>
				</Form.Field>

				<Form.Field
					id="event-unique"
					class="flex items-center gap-2"
					label="Unique Attempt"
					errors={remote.issues?.unique}
				>
					<Checkbox
						name={remote.field('unique')}
						checked={data.event?.unique ?? false}
						class="h-4 w-4"
					/>
				</Form.Field>
			</div>
		</Fieldset>

		<Fieldset title="Scheduling" class="grid gap-2">
			<Form.Field id="event-startsAt" label="Starts At" errors={remote.issues?.startsAt}>
				<Datepicker format="datetime" name={remote.field('startsAt')} />
			</Form.Field>

			<div class="mt-1 flex items-center gap-2 text-sm">
				<Checkbox id="toggle-registerUntil" bind:checked={showRegisterUntil} class="h-4 w-4" />
				<Label for="toggle-registerUntil" class="cursor-pointer font-medium">
					Set registration deadline
				</Label>
			</div>

			{#if showRegisterUntil}
				<div class="-mt-1 pl-6">
					<Form.Field
						id="event-registerUntil"
						label="Register Until"
						errors={remote.issues?.registerUntil}
					>
						<Input type="datetime-local" name={remote.field('registerUntil')} class="h-9" />
					</Form.Field>
				</div>
			{/if}
		</Fieldset>

		<Fieldset title="Relationships" class="grid gap-2">
			<Form.Field id="event-eventTypeId" label="Event Type" errors={remote.issues?.eventTypeId}>
				<Input name={remote.field('eventTypeId')} value={data.event?.eventTypeId} class="h-9" />
			</Form.Field>

			<div class="mt-1 flex items-center gap-2 text-sm">
				<Checkbox id="toggle-trackId" bind:checked={showTrackId} class="h-4 w-4" />
				<Label for="toggle-trackId" class="cursor-pointer font-medium">Link to a track</Label>
			</div>

			{#if showTrackId}
				<div class="-mt-1 pl-6">
					<Form.Field id="event-trackId" label="Track ID" errors={remote.issues?.trackId}>
						<Input name={remote.field('trackId')} value={data.event?.trackId || ''} class="h-9" />
					</Form.Field>
				</div>
			{/if}
		</Fieldset>

		<div class="mt-2 flex justify-end">
			<Button type="submit" class="px-4 py-2">Save Event</Button>
		</div>

		<input type="hidden" name={remote.field('id')} value={data.event?.id} />
	</Form.Root>
</div>
