<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/input.svelte';
	import { Key, LogIn, Mail, Save } from '@lucide/svelte';
	import OAuth from '../oauth.svelte';
	import type { PageProps } from './$types';
	import Form from '$lib/ui/form/form.svelte';
	import Entry from '$lib/ui/form/entry.svelte';
	import type { FormReset, FormUpdate } from './+page.server';

	const { data }: PageProps = $props();
</script>

<div class="space-y-6 p-8">
	{#if data.newPassword}
		<!-- Set New Password UI -->
		<div class="space-y-2">
			<h2 class="text-2xl font-semibold tracking-tight">Set New Password</h2>
			<p class="text-muted-foreground text-sm">Enter your new password to complete the reset process</p>
		</div>

		<div class="space-y-2">
			<Form class="space-y-2">
				{#snippet fields(out)}
					{@const form = out as FormUpdate}
					<Entry name="password" label="New Password" errors={form.errors.password}>
						{#snippet child(props)}
							<Input
								icon={Key}
								required
								placeholder="••••••••"
								type="password"
								title="Please enter your new password"
								{...props}
							/>
						{/snippet}
					</Entry>

					<Entry name="confirmPassword" label="Confirm Password" errors={form.errors.confirm}>
						{#snippet child(props)}
							<Input
								icon={Key}
								required
								placeholder="••••••••"
								type="password"
								title="Please confirm your new password"
								{...props}
							/>
						{/snippet}
					</Entry>

					<div class="space-y-3">
						<Button type="submit" icon={Save} variant="outline" class="w-full">Set Password</Button>
					</div>
				{/snippet}
			</Form>

			<p class="text-muted-foreground text-center text-xs">
				Remember your password?
				<a href="./sign-in" class="text-primary hover:underline">Sign in</a>
			</p>
		</div>
	{:else}
		<!-- Password Reset Request UI -->
		<div class="space-y-2">
			<h2 class="text-2xl font-semibold tracking-tight">Reset Password</h2>
			<p class="text-muted-foreground text-sm">Enter your email address and we'll send you a link to reset your password</p>
		</div>

		<div class="space-y-2">
			<Form class="space-y-2">
				{#snippet fields(out)}
					{@const form = out as FormReset}
					<Entry name="email" label="Email" errors={form.errors.email}>
						{#snippet child(props)}
							<Input
								icon={Mail}
								required
								placeholder="user@example.com"
								type="email"
								title="Please enter your email address"
								{...props}
							/>
						{/snippet}
					</Entry>

					<div class="space-y-3">
						<Button type="submit" icon={Mail} variant="outline" class="w-full">Send Reset Link</Button>
					</div>
				{/snippet}
			</Form>

			<p class="text-muted-foreground text-center text-xs">
				Remember your password?
				<a href="./sign-in" class="text-primary hover:underline">Sign in</a>
			</p>
		</div>
	{/if}
</div>
