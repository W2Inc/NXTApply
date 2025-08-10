<script lang="ts">
	import { Key, Mail, Save } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Oauth from '../oauth.svelte';
	import { FormKit } from '$lib/form.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { forgot, reset } from '../auth.remote';

	const { data }: PageProps = $props();
</script>

<div class="space-y-6 p-8">
	{#if data.token}
		<!-- Set New Password UI -->
		<div class="space-y-2">
			<h2 class="text-2xl font-semibold tracking-tight">Set New Password</h2>
			<p class="text-sm text-muted-foreground">
				Enter your new password to complete the reset process
			</p>
		</div>

		<div class="space-y-2">
			<form {...FormKit.remote(reset)}>
				<input name="token" type="hidden" value={data.token} />
				<FormEntry label="New Password" errors={reset.result?.errors?.password}>
					{#snippet child(id)}
						<Input
							{id}
							name="password"
							type="password"
							required
							placeholder="••••••••"
							title="Please enter your new password"
						/>
					{/snippet}
				</FormEntry>

				<FormEntry label="Confirm Password" errors={reset.result?.errors?.confirm}>
					{#snippet child(id)}
						<Input
							{id}
							name="confirm"
							type="password"
							required
							placeholder="••••••••"
							title="Please confirm your new password"
						/>
					{/snippet}
				</FormEntry>

				<div class="space-y-3">
					<Button type="submit" class="btn btn-outline w-full">Set Password</Button>
				</div>
			</form>

			<p class="text-center text-xs text-muted-foreground">
				Remember your password?
				<a href="./sign-in" class="text-primary hover:underline">Sign in</a>
			</p>
		</div>
	{:else}
		<!-- Password Reset Request UI -->
		<div class="space-y-2">
			<h2 class="text-2xl font-semibold tracking-tight">Reset Password</h2>
			<p class="text-sm text-muted-foreground">
				Enter your email address and we'll send you a reset link
			</p>
		</div>

		<div class="space-y-2">
			<form {...FormKit.remote(forgot)}>
				<FormEntry label="Email" errors={forgot.result?.errors?.email}>
					{#snippet child(id)}
						<Input
							{id}
							name="email"
							type="email"
							required
							placeholder="user@example.com"
							title="Please enter your email address"
						/>
					{/snippet}
				</FormEntry>

				<div class="space-y-3">
					<Button type="submit" class="btn btn-outline w-full">Send Reset Link</Button>
				</div>
			</form>

			<p class="text-center text-xs text-muted-foreground">
				Remember your password?
				<a href="./sign-in" class="text-primary hover:underline">Sign in</a>
			</p>
		</div>
	{/if}
</div>
