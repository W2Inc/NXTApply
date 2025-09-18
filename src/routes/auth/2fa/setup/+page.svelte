<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ShieldCheck } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { setOTP } from '@/remotes/auth/2fa.remote';
	import * as Form from '$lib/components/form';

	let show = $state(false);
	const { data }: PageProps = $props();
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<div class="flex justify-center">
			<ShieldCheck class="h-8 w-8" />
		</div>
		<h2 class="text-2xl font-semibold tracking-tight text-center">Two-Factor Authentication</h2>
		<p class="text-sm text-muted-foreground text-center">
			Scan the QR code with your authenticator app to set up 2FA
		</p>
	</div>

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

	<Form.Root {...FormKit.toastify(setOTP)}>
		<Form.Field id="field:otp" label="Verification Code" errors={setOTP.issues?.otp}>
			<Input
				id="field:otp"
				name="otp"
				type={setOTP.field('otp') || 'text'}
				placeholder="Enter 6-digit code"
				inputmode="numeric"
				autocomplete="off"
				autofocus
				minlength={6}
				maxlength={6}
				required
			/>
		</Form.Field>

		<div class="mt-6">
			<Button type="submit" class="w-full">Verify and Enable 2FA</Button>
		</div>
	</Form.Root>
</div>
