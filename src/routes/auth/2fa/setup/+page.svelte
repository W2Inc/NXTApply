<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import { ShieldCheck, LockKeyhole } from '@lucide/svelte';
	import type { PageData, PageProps } from './$types';
	import Input from '$lib/ui/input.svelte';
	import type { FormOutput } from './+page.server';
	import Form from '$lib/ui/form/form.svelte';
	import Entry from '$lib/ui/form/entry.svelte';
	import Alert from '$lib/ui/alert.svelte';

	const { data }: PageProps = $props();

	let checked = $state(false);
	let otpValue = $state('');
	let disabled = $derived(otpValue.length !== 6);
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h2>
		<p class="text-muted-foreground text-sm">
			Scan the QR code with your authenticator app to set up 2FA
		</p>
	</div>

	<Form class="space-y-4">
		{#snippet fields(out)}
			{@const form = out as FormOutput}
			<div class="bg-muted flex min-h-[128px] items-center justify-center rounded p-4">
				{#if checked}
					<p class="p-4 font-mono text-sm break-words break-all">
						{data.secret}
					</p>
				{:else}
					{@html data.qr}
				{/if}
			</div>

			<div class="flex items-center space-x-2">
				<input type="checkbox" bind:checked id="show-secret" />
				<label for="show-secret" class="cursor-pointer text-sm">View secret key instead</label>
			</div>

			<p class="text-muted-foreground text-sm">
				Open your two-factor authenticator (TOTP) app or browser extension to scan the QR code or
				enter the secret key manually.
			</p>

			<Entry name="otp" label="Verification Code" errors={form.errors.otp}>
				{#snippet child(props)}
					<Input
						icon={LockKeyhole}
						type="text"
						bind:value={otpValue}
						placeholder="Enter 6-digit code"
						inputmode="numeric"
						autocomplete="off"
						autofocus
						required
						disabled={form.loading}
						{...props}
					/>
				{/snippet}
			</Entry>

			<div class="space-y-3">
				<Button
					type="submit"
					icon={ShieldCheck}
					variant="outline"
					class="w-full"
					disabled={disabled || form.loading}
				>
					Verify and Enable 2FA
				</Button>
			</div>

			<Alert
				variant="warning"
				title="2FA is mandatory"
				description="Two-factor authentication is required for your account security. You must complete this step to continue."
			/>

		{/snippet}
	</Form>
</div>
