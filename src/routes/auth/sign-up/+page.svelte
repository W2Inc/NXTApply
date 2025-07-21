<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import Input from '$lib/ui/input.svelte';
	import { Key, KeyRound, LetterText, LogIn, Mail } from '@lucide/svelte';
	import OAuth from '../oauth.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import Entry from '$lib/ui/form/entry.svelte';
	import type { FormOutput } from './+page.server';
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Sign Up</h2>
		<p class="text-muted-foreground text-sm">Enter your information to create an account</p>
	</div>

	<Form class="space-y-2">
		{#snippet fields(out)}
			{@const form = out as FormOutput}

			<div class="grid grid-cols-2 gap-4">
				<Entry label="First Name" name="first" errors={form.errors.first}>
					{#snippet child(props)}
						<Input type="text" required placeholder="Max" {...props} />
					{/snippet}
				</Entry>

				<Entry label="First Name" name="last" errors={form.errors.last}>
					{#snippet child(props)}
						<Input type="text" required placeholder="Robinson" {...props} />
					{/snippet}
				</Entry>
			</div>

			<Entry name="email" label="Email" errors={form.errors.email}>
				{#snippet child(props)}
					<Input icon={Mail} type="email" {...props} placeholder="m@examplerrors.com" required />
				{/snippet}
			</Entry>

			<Entry name="password" label="Password" errors={form.errors.password}>
				{#snippet child(props)}
					<Input icon={KeyRound} type="password" placeholder="••••••••" required {...props} />
				{/snippet}
			</Entry>

			<Entry name="confirm" label="Confirm Password" errors={form.errors.confirm}>
				{#snippet child(props)}
					<Input icon={KeyRound} type="password" placeholder="••••••••" required {...props} />
				{/snippet}
			</Entry>

			<div class="space-y-3">
				<Button type="submit" icon={LogIn} variant="outline" class="w-full">Apply Now</Button>
				<OAuth />
			</div>

			<div class="text-muted-foreground text-center text-xs">
				Already have an account?
				<a href="./sign-in" class="text-primary hover:underline">Sign in</a>
			</div>
		{/snippet}
	</Form>
</div>
