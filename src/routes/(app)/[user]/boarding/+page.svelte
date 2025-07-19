<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import FormEntry from '$lib/ui/form-entry.svelte';
	import Input from '$lib/ui/input.svelte';
	import { User, Users, Phone, Calendar } from '@lucide/svelte';
	import Form from '$lib/ui/form.svelte';
	import Alert from '$lib/ui/alert.svelte';
</script>

<div class="mx-auto max-w-[40rem] p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Welcome Aboard!</h2>
		<p class="text-muted-foreground text-sm">
			Please fill in your personal information to get started.
		</p>
	</div>

	<Form class="space-y-2" type={{} as FormEntry} method="post" enctype="multipart/form-data">
		{#snippet child({ errors })}
			<FormEntry name="firstName" label="First Name">
				{#snippet child(props)}
					<Input icon={User} required placeholder="Enter your first name" type="text" {...props} />
				{/snippet}
			</FormEntry>

			<FormEntry name="lastName" label="Last Name">
				{#snippet child(props)}
					<Input icon={Users} required placeholder="Enter your last name" type="text" {...props} />
				{/snippet}
			</FormEntry>

			<FormEntry name="gender" label="Gender">
				{#snippet child(props)}
					<div class="flex space-x-4">
						<div class="flex items-center">
							<input
								type="radio"
								id="male"
								name="gender"
								value="male"
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
								value="female"
								class="text-primary border-input focus:ring-ring h-4 w-4"
							/>
							<label for="female" class="ml-2 text-sm">Female</label>
						</div>
						<div class="flex items-center">
							<input
								type="radio"
								id="other"
								name="gender"
								value="other"
								class="text-primary border-input focus:ring-ring h-4 w-4"
							/>
							<label for="other" class="ml-2 text-sm">Other</label>
						</div>
					</div>
				{/snippet}
			</FormEntry>

			<FormEntry name="dateOfBirth" label="Date of Birth">
				{#snippet child(props)}
					<Input icon={Calendar} required type="date" {...props} />
				{/snippet}
			</FormEntry>

			<FormEntry name="phoneNumber" label="Phone Number">
				{#snippet child(props)}
					<Input
						icon={Phone}
						required
						placeholder="Enter your phone number"
						type="tel"
						{...props}
					/>
				{/snippet}
			</FormEntry>

			<div class="space-y-3">
				<Button type="submit" variant="outline" class="w-full">Continue</Button>
			</div>
		{/snippet}
	</Form>

	<hr class="my-2" />

	<Alert title="Data Privacy">
		Your personal information is securely stored and handled in accordance with our privacy policy.
		You can read more about it <a class="underline" href="#">here</a>.
	</Alert>
</div>
