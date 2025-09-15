<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';
	// import Alert from '$lib/components/ui/alert/alert.svelte';
	import { ShieldCheck, LockKeyhole } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { setOTP } from '@/remotes/auth/2fa.remote';

	let show = $state(false);
	const { data }: PageProps = $props();
	const form = FormKit.remote(setOTP);

</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h2>
		<p class="text-sm text-muted-foreground">
			Scan the QR code with your authenticator app to set up 2FA
		</p>
	</div>

	<form {...form.remote} class="space-y-2">
		<div class="flex min-h-[128px] items-center justify-center rounded bg-muted p-4">
			{#if show}
				<p class="p-4 font-mono text-sm break-words break-all">
					{data.secret}
				</p>
			{:else}
				{@html data.qr}
			{/if}
		</div>

		<div class="flex items-center space-x-2">
			<Checkbox id="show-secret" bind:checked={show} />
			<label for="show-secret" class="cursor-pointer text-sm">View secret key instead</label>
		</div>

		<p class="text-sm text-muted-foreground">
			Open your two-factor authenticator (TOTP) app or browser extension to scan the QR code or
			enter the secret key manually.
		</p>

		<FormEntry label="Verification Code" errors={form.errors.otp}>
			{#snippet child(id)}
				<Input
					{id}
					name="otp"
					type="text"
					placeholder="Enter 6-digit code"
					inputmode="numeric"
					autocomplete="off"
					autofocus
					required
				/>
			{/snippet}
		</FormEntry>

		<div class="space-y-3">
			<Button type="submit" class="btn btn-outline w-full">Verify and Enable 2FA</Button>
		</div>

		<!-- <Alert.Root variant="destructive">
				<Alert.Title>Unable to process your payment.</Alert.Title>
				<Alert.Description>
					<p>Please verify your billing information and try again.</p>
					<ul class="list-inside list-disc text-sm">
						<li>Check your card details</li>
						<li>Ensure sufficient funds</li>
						<li>Verify billing address</li>
					</ul>
				</Alert.Description>
			</Alert.Root> -->
	</form>
</div>
