<script lang="ts">
	import Form from '$lib/components/form.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { Button, Label, Separator } from 'bits-ui';
	import KeyRound from 'lucide-svelte/icons/key-round';
	import Mail from 'lucide-svelte/icons/mail';
	import LogIn from 'lucide-svelte/icons/log-in';
</script>

<div class="mx-auto grid w-[350px] gap-6">
	<div class="grid gap-2 text-center">
		<h1 class="text-3xl font-bold">
			Login into
			<span class="capitalize"> Apply </span>
		</h1>
		<p class="text-muted-foreground text-balance">
			Enter your email below to login to your account
		</p>
	</div>
	<Form method="POST" class="grid space-y-2">
		<div class="grid gap-1">
			<Label.Root class="label text-xs" for="email">Email</Label.Root>
			<Input
				id="email"
				type="email"
				placeholder="m@example.com"
				name="email"
				icon={Mail}
				title="Insert a valid email."
				required
				autocomplete="off"
			/>
		</div>
		<div class="grid gap-1">
			<div class="flex items-center">
				<Label.Root class="label text-xs" for="password">Password</Label.Root>
				<a href="/auth/forgot" class="link ml-auto inline-block text-xs">
					Forgot your password?
				</a>
			</div>
			<Input
				id="password"
				type="password"
				required
				minlength={6}
				maxlength={255}
				name="password"
				placeholder="*****"
				icon={KeyRound}
			/>
		</div>
		<a href="/auth/signup" class="link text-xs"> Don't have an account yet? </a>
		<Separator.Root class="my-1 divider" />
		<Button.Root id="login" type="submit" class="btn w-full">
			Login
			<LogIn size={20} />
		</Button.Root>
	</Form>
</div>
