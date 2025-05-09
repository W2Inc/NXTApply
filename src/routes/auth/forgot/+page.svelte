<script lang="ts">
	import Input from '$lib/components/ui/input.svelte';
	import { Button, Label } from 'bits-ui';

	let { data } = $props();
</script>

{#snippet resetPassword()}
	<div class="grid gap-2">
		<Label.Root for="new-password">New Password</Label.Root>
		<Input id="new-password" type="password" name="new-password" required />
	</div>
	<!-- <div class="grid gap-2">
		<Label for="new-password2">Confirm Password</Label>
		<Input id="new-password2" type="password" name="new-password2" required />
	</div> -->
	<hr />
	<Button.Root type="submit" formaction="/auth/forgot?/reset" class="mt-2 w-full">Send request</Button.Root>
{/snippet}

{#snippet sendRequest()}
	<div class="grid gap-2">
		<Label.Root for="email">Email</Label.Root>
		<Input
			id="email"
			type="email"
			placeholder="m@example.com"
			title="Insert a valid email."
			name="email"
			required
		/>
	</div>
	<Button.Root type="submit" formaction="/auth/forgot?/request" class="mt-2 btn w-full">Send request</Button.Root>
{/snippet}

<div class="mx-auto grid w-[350px] gap-6">
	<div class="grid gap-2 text-center">
		<h1 class="text-3xl font-bold">Forgot Password</h1>
		<p class="text-muted-foreground text-balance">
			{#if data.token}
				Enter your new password and confirm it. Make sure it's at least 6 characters long and please
				remember it this time.
			{:else}
				Please enter your email address to reset your password. We'll send you a link to reset it.
			{/if}
		</p>
	</div>
	<form class="grid gap-4">
		{#if data.token}
			<input type="hidden" name="token" value={data.token} />
			{@render resetPassword()}
		{:else}
			{@render sendRequest()}
		{/if}
	</form>
</div>
