<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Oauth from '../oauth.svelte';
	import { signup } from '@/remotes/auth/signup.remote';
	import * as Form from '$lib/components/form';
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Sign Up</h2>
		<p class="text-sm text-muted-foreground">Enter your information to create an account</p>
	</div>

	<div class="space-y-2">
		<Form.Root {...FormKit.toastify(signup)}>
			<Form.Field id="field:email" label="Email" errors={signup.issues?.email}>
				<Input
					id="field:email"
					name={signup.field('email')}
					type="email"
					required
					placeholder="user@example.com"
					title="Please give a valid Email"
				/>
			</Form.Field>

			<Form.Field id="field:password" label="Password" errors={signup.issues?._password}>
				<Input
					id="field:password"
					name={signup.field('_password')}
					type="password"
					required
					placeholder="••••••••"
					title="Please give a valid Password"
				/>
			</Form.Field>

			<Form.Field id="field:confirm" label="Confirm Password" errors={signup.issues?._confirm}>
				<Input
					id="field:confirm"
					name={signup.field('_confirm')}
					type="password"
					required
					placeholder="••••••••"
					title="Please confirm your password"
				/>
			</Form.Field>

			<div class="space-y-3">
				<Button type="submit" class="btn btn-outline w-full">Apply Now</Button>
				<Oauth />
			</div>
		</Form.Root>

		<p class="text-center text-xs text-muted-foreground">
			Already have an account?
			<a href="./signin" class="text-primary hover:underline">Sign in</a>
		</p>
	</div>
</div>
