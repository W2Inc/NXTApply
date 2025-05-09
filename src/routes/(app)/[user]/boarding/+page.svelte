<script lang="ts">
	import Alert from '$lib/components/ui/alert.svelte';
	import Form from '$lib/components/form.svelte';
	import Select from '$lib/components/ui/select.svelte';
	import { Label, Separator } from 'bits-ui';
	import ShieldCheck from 'lucide-svelte/icons/shield-check';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';

	// Define form data options
	const genderOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'non-binary', label: 'Non-binary' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	];

</script>

<div class="bg-background px-4 py-12 sm:px-6 lg:px-8">
	<div class="bg-muted border-border-card mx-auto max-w-md overflow-hidden rounded">
		<div class="px-6 py-8">
			<h2 class="text-foreground mb-2 text-center text-2xl font-bold">Complete Your Profile</h2>
			<Alert
				variant="info"
				icon={ShieldCheck}
				title="Data privacy"
				message="All private information is securily stored according to our privacy policy."
			/>
			<Form class="space-y-1 pt-4">
				<!-- Name fields -->
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div>
						<Label.Root for="first_name" class="label text-xs">First Name*</Label.Root>
						<Input
							type="text"
							id="first_name"
							name="first_name"
							pattern="[A-Za-z\s\-']+"
							title="Please enter a valid name (letters, spaces, hyphens, and apostrophes only)"
							required
						/>
					</div>
					<div>
						<Label.Root for="last_name" class="label text-xs">Last Name*</Label.Root>
						<Input
							type="text"
							id="last_name"
							name="last_name"
							pattern="[A-Za-z\s\-']+"
							title="Please enter a valid name (letters, spaces, hyphens, and apostrophes only)"
							required
						/>
					</div>
				</div>

				<!-- Date of Birth -->
				<div>
					<Label.Root for="dob" class="label text-xs">Date of Birth*</Label.Root>
					<Input
						type="date"
						id="dob"
						name="dob"
						class="w-full"
						title="Please enter your date of birth"
						required
					/>
				</div>

				<!-- Gender -->
				<div>
					<Label.Root for="gender" class="label text-xs">Gender*</Label.Root>
					<Select required items={genderOptions} name="gender" type="single" />
				</div>

				<!-- Phone -->
				<div>
					<Label.Root for="phone" class="label text-xs">Phone Number*</Label.Root>
					<Input
						required
						type="tel"
						id="phone"
						name="phone"
						pattern="\+?[0-9\s\-\(\)]+"
						title="Please enter a valid phone number (e.g., +1 (555) 123-4567)"
						placeholder="+1 (555) 123-4567"
					/>
				</div>

				<Separator.Root class="divider my-1" />

				<!-- Submit Button -->
				<div>
					<Button type="submit" class="btn w-full">Complete Profile</Button>
				</div>
			</Form>
		</div>
	</div>
</div>
