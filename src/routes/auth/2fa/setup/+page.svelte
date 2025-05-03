<script lang="ts">
	import Form from '$lib/components/form.svelte';
	import Input from '$lib/components/input.svelte';
	import { Button, Separator } from 'bits-ui';
	import { ShieldCheck } from 'lucide-svelte/icons';
	import type { PageProps } from './$types';
	import Checkbox from '$lib/components/checkbox.svelte';

	const { data }: PageProps = $props();
	let value = $state('');
	let checked = $state(false);
	let disabled = $derived(value.length === 0);
</script>

<Form method="post" class="max-w-sm">
	<div class="flex flex-col gap-2 p-4 border rounded-md">
		{#if checked}
			<p class="rounded-lg bg-[hsl(var(--muted))] p-4 break-words break-all">
				{data.secret}
			</p>
		{:else}
			{@html data.qr}
		{/if}
		<div class="flex items-center space-x-2">
			<Checkbox bind:checked={checked} labelText="View URI instead"/>
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

	<div class="mt-4 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
		<ShieldCheck class="h-5 w-5 flex-shrink-0 text-amber-600" />
		<div>
			<h3 class="font-medium">2FA is mandatory!</h3>
			<p class="text-sm">Two-factor authentication is mandatory. You must set it up to continue.</p>
		</div>
	</div>
</Form>
