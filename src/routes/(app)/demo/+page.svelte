<script>
	import FormEntry from '$lib/ui/form/form-entry.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import Input from '$lib/ui/input.svelte';
	import Select from '$lib/ui/select.svelte';
	import Fieldset from '$lib/ui/track/fieldset.svelte';
	import { Home } from '@lucide/svelte';

	let icons = $state(false);
	let icon = $derived(icons ? Home : undefined);
</script>

<FormEntry id="kek" type="checkbox" name="Enable" bind:checked={icons} />

<!-- Form component already does POST and enctype -->
<Form action="?/example" class="space-y-2 pt-4">
	{#snippet fields(out)}
		<Fieldset title="Text inputs">
			<FormEntry
				id="text"
				type="text"
				name="username"
				label="Username"
				description="Enter your username."
				{icon}
				iconSize={18}
				value="wizard"
				errors={['Must be at least 3 characters']}
			/>
			<FormEntry
				id="email"
				type="email"
				name="email"
				label="Email"
				description="We'll never share your email."
				{icon}
				value="wizard@example.com"
			/>
			<FormEntry
				id="password"
				type="password"
				name="password"
				label="Password"
				description="Choose a strong password."
				{icon}
			/>
		</Fieldset>

		<Fieldset title="Number & Date Inputs">
			<FormEntry
				id="number"
				type="number"
				name="age"
				label="Age"
				description="Enter your age."
				{icon}
				value={30}
			/>
			<FormEntry
				id="date"
				type="date"
				name="birthday"
				label="Birthday"
				description="Pick your birth date."
				{icon}
			/>
			<FormEntry
				id="datetime-local"
				type="datetime-local"
				name="meeting"
				label="Meeting Time"
				description="Schedule a meeting."
				{icon}
			/>
		</Fieldset>

		<Fieldset title="Color & Range">
			<FormEntry
				id="color"
				type="color"
				name="favoriteColor"
				label="Favorite Color"
				description="Pick your favorite color."
				{icon}
				value="#ff0000"
			/>
			<FormEntry
				id="range"
				type="range"
				name="volume"
				label="Volume"
				description="Adjust the volume."
				{icon}
				value={50}
			/>
		</Fieldset>

		<Fieldset title="Checkboxes">
			<FormEntry
				id="newsletter"
				type="checkbox"
				name="newsletter"
				label="Subscribe to newsletter"
				description="Get updates via email."
				{icon}
				checked={true}
				group="preferences"
			/>
			<FormEntry
				id="terms"
				type="checkbox"
				name="terms"
				label="Accept Terms"
				description="You must accept the terms."
				{icon}
				errors="You must accept the terms."
				group="preferences"
			/>
		</Fieldset>

		<Fieldset title="Radio Group">
			<FormEntry
				id="gender-male"
				type="radio"
				name="gender"
				label="Male"
				{icon}
				checked={true}
				group="gender"
			/>
			<FormEntry
				id="gender-female"
				type="radio"
				name="gender"
				label="Female"
				{icon}
				group="gender"
			/>
			<FormEntry
				id="gender-other"
				type="radio"
				name="gender"
				label="Other"
				{icon}
				group="gender"
			/>
		</Fieldset>

		<Fieldset title="File">
			<FormEntry
				id="file"
				type="file"
				name="resume"
				label="Upload Resume"
				description="PDF only."
				{icon}
			/>
		</Fieldset>

		<Fieldset title="Special Inputs">
			<FormEntry id="month" type="month" name="startMonth" label="Start Month" {icon} />
			<FormEntry id="week" type="week" name="startWeek" label="Start Week" {icon} />
			<FormEntry id="time" type="time" name="alarm" label="Alarm Time" {icon} />
			<FormEntry
				id="url"
				type="url"
				name="website"
				label="Website"
				description="Your personal website."
				{icon}
			/>
			<FormEntry
				id="search"
				type="search"
				name="search"
				label="Search"
				description="Search for something."
				{icon}
			/>
		</Fieldset>

		<Fieldset title="Select & Textarea">
			<FormEntry
				id="select"
				type="select"
				name="favorite"
				label="Favorite Number"
				description="Pick your favorite number."
				{icon}
				value="2"
			>
				<option value="1">One</option>
				<option value="2">Two</option>
				<option value="3">Three</option>
				<option value="4">Four</option>
			</FormEntry>
			<FormEntry
				id="textarea"
				type="textarea"
				name="bio"
				label="Bio"
				description="Tell us about yourself."
				{icon}
				value="I'm a wizard!"
			/>
		</Fieldset>
	{/snippet}
</Form>
