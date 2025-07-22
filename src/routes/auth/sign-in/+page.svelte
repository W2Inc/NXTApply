<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/input.svelte';
	import { Key, LogIn, Mail } from '@lucide/svelte';
	import OAuth from '../oauth.svelte';
	import Entry from '$lib/ui/form/entry.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import type { FormOutput } from './proxy+page.server';
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Login</h2>
		<p class="text-muted-foreground text-sm">Enter your email to sign in to your account</p>
	</div>

	<div class="space-y-2">
		<Form class="space-y-2">
			{#snippet fields(f)}
				{@const form = f as FormOutput}
				<Entry name="email" label="Email" errors={form.errors.email}>
					{#snippet child(props)}
						<Input
							icon={Mail}
							required
							placeholder="user@example.com"
							type="email"
							title="Please give a valid Email"
							{...props}
						/>
					{/snippet}
				</Entry>

				<Entry name="password" label="Password" errors={form.errors.password}>
					{#snippet child(props)}
						<div class="tracking-tight">
							<Input
								icon={Key}
								required
								placeholder="••••••••"
								type="password"
								title="Please give a valid Password"
								{...props}
							/>
							<a href="./reset" class="text-primary text-xs hover:underline"> Reset Password </a>
						</div>
					{/snippet}
				</Entry>

				<div class="space-y-3">
					<Button type="submit" icon={LogIn} variant="outline" class="w-full">Sign In</Button>
					<OAuth />
				</div>
			{/snippet}
		</Form>

		<p class="text-muted-foreground text-center text-xs">
			Don't have an account?
			<a href="./sign-up" class="text-primary hover:underline">Sign up</a>
		</p>
	</div>
</div>
