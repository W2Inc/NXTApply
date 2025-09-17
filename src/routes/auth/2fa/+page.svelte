<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Phone from '@lucide/svelte/icons/smartphone';
	import { verifyOTP } from '@/remotes/auth/2fa.remote';
	import * as Form from '$lib/components/form';
</script>

<div class="mx-auto max-w-sm space-y-6 p-8">
	<div class="space-y-2 text-center">
		<div class="flex justify-center">
			<Phone class="h-8 w-8" />
		</div>
		<h2 class="text-2xl font-semibold tracking-tight">Authentication Code</h2>
		<p class="text-sm text-muted-foreground">
			Open your two-factor authenticator (TOTP) app or browser extension to view your authentication
			code.
		</p>
	</div>

	<Form.Root {...FormKit.toastify(verifyOTP)}>
		<Form.Field id="field:otp" label="Authentication Code" errors={verifyOTP.issues?.otp}>
			<Input
				id="field:otp"
				name="otp"
				type={verifyOTP.field('otp')}
				minlength={6}
				maxlength={6}
				required
				autocomplete="one-time-code"
				autofocus={true}
				inputmode="numeric"
				placeholder="XXXXXX"
				aria-labelledby="session-otp-input-label"
				aria-describedby="session-otp-input-description"
			/>
		</Form.Field>

		<div class="mt-6">
			<Button type="submit" class="btn w-full">Verify</Button>
		</div>
	</Form.Root>
</div>
