<script lang="ts">
	import Form from '$lib/components/form.svelte';
	import Input from '$lib/components/input.svelte';
	import { Button, Label, Separator } from 'bits-ui';

	const { data } = $props();
</script>

<div class="mx-auto grid w-[350px] gap-6">
	<div class="grid gap-2 text-center">
		<h1 class="text-3xl font-bold">
			Login into
			<span class="capitalize">
				Apply
			</span>
		</h1>
		<p class="text-muted-foreground text-balance">
			Enter your email below to login to your account
		</p>
	</div>
	<Form method="POST" class="grid gap-4">
		<div class="grid gap-2">
			<Label.Root for="email">Email</Label.Root>
			<Input
				id="email"
				type="email"
				placeholder="m@example.com"
				name="email"
				title="Insert a valid email."
				required
				autocomplete="off"
			/>
		</div>
		<div class="grid gap-2">
			<div class="flex items-center">
				<Label.Root for="password">Password</Label.Root>
					<a href="/auth/forgot" class="ml-auto inline-block text-sm underline">
						Forgot your password?
					</a>
			</div>
			<Input id="password" type="password" required minlength={6} maxlength={255} name="password" />
		</div>
			<a href="/auth/signup" class="text-sm underline"> Don't have an account yet? </a>
		<Separator.Root class="my-2"></Separator.Root>
		<Button.Root type="submit" class="w-full">Login</Button.Root>
	</Form>
</div>
