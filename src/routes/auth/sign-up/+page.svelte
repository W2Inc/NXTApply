<script lang="ts">
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { FormKit } from '$lib/form.svelte';
	import { SelectItem } from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Oauth from '../oauth.svelte';
	import { signup } from '../auth.remote';
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Sign Up</h2>
		<p class="text-sm text-muted-foreground">Enter your information to create an account</p>
	</div>

	<div class="space-y-2">
		<form {...FormKit.remote(signup)}>
			<div class="grid grid-cols-2 gap-4">
				<FormEntry label="First Name" errors={signup.result?.errors?.first}>
					{#snippet child(id)}
						<Input
							{id}
							name="first"
							type="text"
							required
							placeholder="Max"
							title="Please enter your first name"
						/>
					{/snippet}
				</FormEntry>
				<FormEntry label="Last Name" errors={signup.result?.errors?.last}>
					{#snippet child(id)}
						<Input
							{id}
							name="last"
							type="text"
							required
							placeholder="Robinson"
							title="Please enter your last name"
						/>
					{/snippet}
				</FormEntry>
			</div>

			<FormEntry label="Email" errors={signup.result?.errors?.email}>
				{#snippet child(id)}
					<Input
						{id}
						name="email"
						type="email"
						required
						placeholder="user@example.com"
						title="Please give a valid Email"
					/>
				{/snippet}
			</FormEntry>

			<FormEntry label="Password" errors={signup.result?.errors?.password}>
				{#snippet child(id)}
					<Input
						{id}
						name="password"
						type="password"
						required
						placeholder="••••••••"
						title="Please give a valid Password"
					/>
				{/snippet}
			</FormEntry>

			<FormEntry label="Confirm Password" errors={signup.result?.errors?.confirm}>
				{#snippet child(id)}
					<Input
						{id}
						name="confirm"
						type="password"
						required
						placeholder="••••••••"
						title="Please confirm your password"
					/>
				{/snippet}
			</FormEntry>

			<div class="space-y-3">
				<Button type="submit" class="btn btn-outline w-full">Apply Now</Button>
				<Oauth />
			</div>
		</form>

		<p class="text-center text-xs text-muted-foreground">
			Already have an account?
			<a href="./sign-in" class="text-primary hover:underline">Sign in</a>
		</p>
	</div>
</div>
