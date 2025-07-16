<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import FormEntry from '$lib/ui/form-entry.svelte';
	import Input from '$lib/ui/input.svelte';
	import { Key, KeyRound, LetterText, LogIn, Mail } from '@lucide/svelte';
	import OAuth from '../oauth.svelte';
	import Form from '$lib/ui/form.svelte';
	import type { FormEntries } from './+page.server';
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Sign Up</h2>
		<p class="text-muted-foreground text-sm">Enter your information to create an account</p>
	</div>

	<Form class="space-y-2" type={{} as FormEntries}>
		{#snippet child({ errors })}
			<div class="grid grid-cols-2 gap-4">
				<FormEntry label="First Name" name="first" errors={errors.first}>
					{#snippet child(props)}
						<Input type="text" required placeholder="Max" {...props} />
					{/snippet}
				</FormEntry>

				<FormEntry label="First Name" name="last" errors={errors.last}>
					{#snippet child(props)}
						<Input type="text" required placeholder="Robinson" {...props} />
					{/snippet}
				</FormEntry>
			</div>

			<FormEntry name="email" label="Email" errors={errors.email}>
				{#snippet child(props)}
					<Input icon={Mail} type="email" {...props} placeholder="m@example.com" required />
				{/snippet}
			</FormEntry>

			<FormEntry name="password" label="Password" errors={errors.password}>
				{#snippet child(props)}
					<Input icon={KeyRound} type="password" placeholder="••••••••" required {...props} />
				{/snippet}
			</FormEntry>

			<FormEntry name="confirm" label="Confirm Password" errors={errors.confirm}>
				{#snippet child(props)}
					<Input icon={KeyRound} type="password" placeholder="••••••••" required {...props} />
				{/snippet}
			</FormEntry>

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
