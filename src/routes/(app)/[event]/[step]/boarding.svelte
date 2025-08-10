<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { User, Users, Phone, Calendar } from '@lucide/svelte';

	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import DatePicker from '$lib/components/date-picker.svelte';
	import { CalendarDate, getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import { page } from '$app/state';
	const boarding = {};

	let date = $state<DateValue>();
</script>

<div class="mx-auto max-w-[40rem] p-8">
	<h2 class="text-2xl font-semibold tracking-tight">Welcome Aboard!</h2>
	<p class="text-sm text-muted-foreground">
		Please fill in your personal information to get started.
	</p>

	<Separator class="my-3"/>

	<form>
		<FormEntry label="First Name" errors={boarding.result?.errors?.firstName}>
			{#snippet child(id)}
				<Input {id} name="firstName" type="text" required placeholder="Enter your first name" />
			{/snippet}
		</FormEntry>

		<FormEntry label="Last Name" errors={boarding.result?.errors?.lastName}>
			{#snippet child(id)}
				<Input {id} name="lastName" type="text" required placeholder="Enter your last name" />
			{/snippet}
		</FormEntry>

		<FormEntry label="Gender" errors={boarding.result?.errors?.gender}>
			{#snippet child(id)}
				<RadioGroup.Root value="comfortable" class="flex w-full items-center gap-2">
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="1" id="male" />
						<Label for="male">Male</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="0" id="female" />
						<Label for="female">Female</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="2" id="other" />
						<Label for="other">Rather Not Say</Label>
					</div>
				</RadioGroup.Root>
			{/snippet}
		</FormEntry>

		<FormEntry label="Date of Birth" errors={boarding.result?.errors?.dateOfBirth}>
			{#snippet child(id)}
				<DatePicker
					name="dob"
					minValue={new CalendarDate(1960, 1, 1)}
					maxValue={today(getLocalTimeZone())}
				/>
			{/snippet}
		</FormEntry>

		<FormEntry label="Phone Number" errors={boarding.result?.errors?.phoneNumber}>
			{#snippet child(id)}
				<Input {id} name="phoneNumber" type="tel" required placeholder="Enter your phone number" />
			{/snippet}
		</FormEntry>

		<div class="space-y-3">
			<Button type="submit" class="btn btn-outline w-full">Continue</Button>
		</div>
	</form>

	<hr class="my-2" />

	<Alert.Root>
		<Alert.Title>Data Privacy</Alert.Title>
		<Alert.Description>
			Your personal information is securely stored and handled in accordance with our privacy
			policy. You can read more about it <a class="underline" href="#">here</a>.
		</Alert.Description>
	</Alert.Root>

	{#if boarding.result?.success}
		<p>Successfully published!</p>
	{/if}
</div>
