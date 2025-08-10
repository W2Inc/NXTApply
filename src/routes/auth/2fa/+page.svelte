<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Phone from '@lucide/svelte/icons/smartphone';
	import { verifyOTP } from '../auth.remote';
</script>

<div class="space-y-6 p-8 max-w-sm mx-auto">
	<div class="space-y-2 text-center">
		<div class="flex justify-center">
			<Phone class="w-8 h-8" />
		</div>
		<h2 class="text-2xl font-semibold tracking-tight">Authentication Code</h2>
		<p class="text-sm text-muted-foreground">
			Open your two-factor authenticator (TOTP) app or browser extension to view your authentication code.
		</p>
	</div>

	<form {...FormKit.remote(verifyOTP)}>
		<FormEntry label="Authentication Code" errors={verifyOTP.result?.errors?.otp}>
			{#snippet child(id)}
				<Input
					{id}
					name="otp"
					type="text"
					minlength={6}
					maxlength={6}
					required
					autocomplete="off"
					autofocus={true}
					inputmode="numeric"
					placeholder="XXXXXX"
					aria-labelledby="session-otp-input-label"
					aria-describedby="session-otp-input-description"
				/>
			{/snippet}
		</FormEntry>

		<div class="mt-6">
			<Button type="submit" class="btn w-full">Verify</Button>
		</div>
	</form>
</div>
