<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/input.svelte';
	import { User, Users, Phone, Calendar } from '@lucide/svelte';
	import Alert from '$lib/ui/alert.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import Entry from '$lib/ui/form/entry.svelte';
	import { boarding } from './boarding.remote';
	// import type { FormOutput } from './+page.server';
</script>

<div class="mx-auto max-w-[40rem] p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Welcome Aboard!</h2>
		<p class="text-muted-foreground text-sm">
			Please fill in your personal information to get started.
		</p>
	</div>

	<form class="space-y-2" {...boarding}>
		<!-- {#snippet fields(out)} -->
		<!-- {@const form = out as FormOutput} -->
		<Entry name="firstName" label="First Name">
			{#snippet child(props)}
				<Input icon={User} required placeholder="Enter your first name" type="text" {...props} />
			{/snippet}
		</Entry>

		<Entry name="lastName" label="Last Name">
			{#snippet child(props)}
				<Input icon={Users} required placeholder="Enter your last name" type="text" {...props} />
			{/snippet}
		</Entry>

		<Entry name="gender" label="Gender">
			{#snippet child(props)}
				<div class="flex space-x-4">
					<div class="flex items-center">
						<input
							type="radio"
							id="male"
							name="gender"
							value="1"
							class="text-primary border-input focus:ring-ring h-4 w-4"
							required
						/>
						<label for="male" class="ml-2 text-sm">Male</label>
					</div>
					<div class="flex items-center">
						<input
							type="radio"
							id="female"
							name="gender"
							value="0"
							class="text-primary border-input focus:ring-ring h-4 w-4"
						/>
						<label for="female" class="ml-2 text-sm">Female</label>
					</div>
					<div class="flex items-center">
						<input
							type="radio"
							id="other"
							name="gender"
							value="2"
							class="text-primary border-input focus:ring-ring h-4 w-4"
						/>
						<label for="other" class="ml-2 text-sm">Other</label>
					</div>
				</div>
			{/snippet}
		</Entry>

		<Entry name="dateOfBirth" label="Date of Birth">
			{#snippet child(props)}
				<Input icon={Calendar} required type="date" {...props} />
			{/snippet}
		</Entry>

		<Entry name="phoneNumber" label="Phone Number">
			{#snippet child(props)}
				<Input icon={Phone} required placeholder="Enter your phone number" type="tel" {...props} />
			{/snippet}
		</Entry>

		<div class="space-y-3">
			<Button type="submit" variant="outline" class="w-full">Continue</Button>
		</div>
		<!-- {/snippet} -->
	</form>

	<hr class="my-2" />

	<Alert title="Data Privacy">
		Your personal information is securely stored and handled in accordance with our privacy policy.
		You can read more about it <a class="underline" href="#">here</a>.
	</Alert>

	{#if boarding.result?.success}
		<p>Successfully published!</p>
	{/if}
</div>
