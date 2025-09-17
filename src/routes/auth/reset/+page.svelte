<script lang="ts">
	import { CircleCheck, Key, Mail, Save } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Oauth from '../oauth.svelte';
	import { FormKit } from '$lib/form.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { forgot } from '@/remotes/auth/forgot.remote';
	import { reset } from '@/remotes/auth/reset.remote';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Form from '$lib/components/form';

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
			<Form.Root {...FormKit.toastify(reset)}>
				<input name={reset.field('token')} type="hidden" value={data.token} />
				<Form.Field id="field:pw" label="New Password" errors={reset.issues?._password}>
					<Input
						id="field:pw"
						name={reset.field('_password')}
						type="password"
						required
						placeholder="••••••••"
						title="Please enter your new password"
					/>
				</Form.Field>

				<Form.Field id="field:confirm" label="Confirm Password" errors={reset.issues?.confirm}>
					<Input
						id="field:confirm"
						name={reset.field('_confirm')}
						type="password"
						required
						placeholder="••••••••"
						title="Please confirm your new password"
					/>
				</Form.Field>

				<div class="space-y-3">
					<Button type="submit" class="btn btn-outline w-full">Set Password</Button>
				</div>
			</Form.Root>

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
			<Form.Root {...FormKit.toastify(forgot)}>
				<Form.Field id="field:email" label="Email" errors={forgot.issues?.email}>
					<Input
						id="field:email"
						name="email"
						type="email"
						required
						placeholder="user@example.com"
						title="Please enter your email address"
					/>
				</Form.Field>

				<div class="space-y-3">
					<Button loading={forgot.pending > 0} type="submit" class="btn btn-outline w-full">
						Send Reset Link
					</Button>
				</div>
			</Form.Root>

			<p class="text-center text-xs text-muted-foreground">
				Remember your password?
				<a href="./signin" class="text-primary hover:underline">Sign in</a>
			</p>
		</div>
	{/if}
</div>
