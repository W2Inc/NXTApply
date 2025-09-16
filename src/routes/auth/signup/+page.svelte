<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Oauth from '../oauth.svelte';
	import { signup } from '@/remotes/auth/signup.remote';
	import FormMessage from '$lib/components/form-message.svelte';

	const form = FormKit.remote(signup);
</script>


<div class="space-y-6 p-8">
	<FormMessage {form} />

	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Sign Up</h2>
		<p class="text-sm text-muted-foreground">Enter your information to create an account</p>
	</div>

	<div class="space-y-2">
		<form {...form.remote}>
			<FormEntry label="Email" errors={form.errors.email}>
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

			<FormEntry label="Password" errors={form.errors.password}>
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

			<FormEntry label="Confirm Password" errors={form.errors.confirm}>
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
			<a href="./signin" class="text-primary hover:underline">Sign in</a>
		</p>
	</div>
</div>
