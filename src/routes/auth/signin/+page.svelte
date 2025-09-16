<script>
	import { FormKit } from '$lib/form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Oauth from '../oauth.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import { Input } from '$lib/components/ui/input';
	import { signin } from '@/remotes/auth/signin.remote';
	import FormMessage from '$lib/components/form-message.svelte';

	const form = FormKit.remote(signin);
</script>

<div class="space-y-6 p-8">
	<FormMessage {form} />
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Login</h2>
		<p class="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
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
					<div class="tracking-tight">
						<Input
							{id}
							name="password"
							type="password"
							required
							placeholder="••••••••"
							title="Please give a valid Password"
						/>
						<a href="./reset" class="text-xs text-primary hover:underline">Reset Password</a>
					</div>
				{/snippet}
			</FormEntry>

			<div class="space-y-3">
				<Button type="submit" class="btn btn-outline w-full">Sign In</Button>
				<Oauth />
			</div>
		</form>

		<p class="text-center text-xs text-muted-foreground">
			Don't have an account?
			<a href="./signup" class="text-primary hover:underline">Sign up</a>
		</p>
	</div>
</div>
