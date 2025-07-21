<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import { ShieldCheck, LockKeyhole } from '@lucide/svelte';
	import type { PageData, PageProps } from './$types';
	import Input from '$lib/ui/input.svelte';
	import type { FormOutput } from './+page.server';
	import Form from '$lib/ui/form/form.svelte';
	import Entry from '$lib/ui/form/entry.svelte';

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

			<div class="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4">
				<div class="flex items-start gap-3">
					<ShieldCheck class="mt-0.5 h-5 w-5 text-amber-600" />
					<div>
						<h4 class="font-medium text-amber-800">2FA is mandatory</h4>
						<p class="text-sm text-amber-700">
							Two-factor authentication is required for your account security. You must complete
							this step to continue.
						</p>
					</div>
				</div>
			</div>
		{/snippet}
	</Form>
</div>
