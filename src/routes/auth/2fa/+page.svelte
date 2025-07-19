<script lang="ts">
	import Phone from '@lucide/svelte/icons/smartphone';
	import Input from '$lib/ui/input.svelte';
	import Form from '$lib/ui/form.svelte';
	import FormEntry from '$lib/ui/form-entry.svelte';
	import type { FormEntries } from './+page.server';
	import Button from '$lib/ui/button.svelte';
</script>

<form method="post" class="max-w-sm">
	<div class="flex flex-col justify-center gap-2 p-4">
		<div class="grid place-items-center gap-2">
			<Phone />
			<h1>Authentication code</h1>
		</div>
		<Form type={{} as FormEntries}>
			{#snippet child({ errors })}
				<FormEntry name="otp" errors={errors.otp}>
					{#snippet child(props)}
						<Input
							type="text"
							value=""
							minlength={6}
							maxlength={6}
							aria-labelledby="session-otp-input-label"
							aria-describedby="session-otp-input-description"
							autocomplete="off"
							autofocus={true}
							inputmode="numeric"
							placeholder="XXXXXX"
							{...props}
						/>
					{/snippet}
				</FormEntry>
			{/snippet}
		</Form>

		<hr />
		<Button type="submit" class="btn">Verify</Button>
		<p>
			Open your two-factor authenticator (TOTP) app or browser extension to view your authentication
			code.
		</p>
	</div>
</form>
