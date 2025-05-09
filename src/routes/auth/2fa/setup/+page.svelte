<script lang="ts">
	import Form from '$lib/components/form.svelte';
	import { Button, Separator } from 'bits-ui';
	import { ShieldCheck } from 'lucide-svelte/icons';
	import type { PageProps } from './$types';
	import Input from '$lib/components/ui/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox.svelte';

	const { data }: PageProps = $props();
	let value = $state('');
	let checked = $state(false);
	let disabled = $derived(value.length === 0);
</script>

<Form method="post" class="max-w-sm">
	<div class="flex flex-col gap-2">
		<span class="min-h-[256px bg-muted rounded p-1">
			{#if checked}
				<p class="break-words break-all">
					{data.secret}
				</p>
			{:else}
				{@html data.qr}
			{/if}
		</span>
		<div class="flex items-center space-x-2">
			<Checkbox bind:checked labelText="View URI instead" />
		</div>
		<p>
			Open your two-factor authenticator (TOTP) app or browser extension to scan your authentication
			code.
		</p>

		<Input
			bind:value
			type="text"
			name="otp"
			id="otp"
			icon={}
			minlength={6}
			maxlength={6}
			aria-labelledby="session-otp-input-label"
			aria-describedby="session-otp-input-description"
			autocomplete="off"
			autofocus={true}
			inputmode="numeric"
			placeholder="XXXXXX"
		/>
		<Separator.Root />
		<Button.Root type="submit" {disabled} aria-disabled={disabled}>Next</Button.Root>
	</div>

	<Alert
		icon={ShieldCheck}
		title="2FA is mandatory!"
		message="Two-factor authentication is mandatory. You must set it up to continue."
	/>
</Form>
