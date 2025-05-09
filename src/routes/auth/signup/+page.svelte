<script lang="ts">
	import Form from "$lib/components/form.svelte";
	import Input from "$lib/components/ui/input.svelte";
	import { Button, Label, Separator } from "bits-ui";
	import Rocket from "lucide-svelte/icons/rocket";

</script>

<div class="mx-auto grid w-[350px] gap-6">
	<div class="grid gap-2 text-center">
		<h1 class="text-3xl font-bold">Login</h1>
		<p class="text-balance text-muted-foreground">
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
				autocomplete="off"
				title="Insert a valid email."
				required
			/>
		</div>
		<div class="grid gap-2">
			<Label.Root for="password">Password</Label.Root>
			<Input id="password" type="password" required minlength={6} maxlength={255} autocomplete="off" name="password" />
		</div>

		<div class="grid gap-2">
			<Label.Root for="password">Confirm Password</Label.Root>
			<Input
				id="c-password"
				type="password"
				required
				minlength={6}
				maxlength={255}
				autocomplete="off"
				name="c-password"
			/>
		</div>

		<a href="/auth/signin" class="text-sm underline"> Already have an account? </a>
		<Separator.Root class="my-2 border"></Separator.Root>
		<Button.Root type="submit" class="w-full btn transition-all hover:shadow-[0_0_8px_rgba(35_166_213_0.7)] hover:shadow-blue-400/70">
			Create Account
			<Rocket size={20} />
		</Button.Root>
	</Form>
</div>
