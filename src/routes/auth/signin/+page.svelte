<script>
	import { FormKit } from '$lib/form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Oauth from '../oauth.svelte';
	import { Input } from '$lib/components/ui/input';
	import { signin } from '@/remotes/auth/signin.remote';
	import * as Form from '$lib/components/form';
</script>

<div class="space-y-6 p-8">
	<div class="space-y-2">
		<h2 class="text-2xl font-semibold tracking-tight">Login</h2>
		<p class="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
	</div>

	<div class="space-y-2">
		<Form.Root {...FormKit.toastify(signin)}>
			<Form.Field id="email" label="Email" errors={signin.issues?.email}>
				<Input
					id="email"
					name={signin.field('email')}
					type="email"
					required
					placeholder="user@example.com"
					title="Please give a valid Email"
				/>
			</Form.Field>

			<div class="tracking-tight">
				<Form.Field id="password" label="Password" errors={signin.issues?._password}>
					<Input
						id="password"
						name={signin.field('_password')}
						type="password"
						required
						placeholder="••••••••"
						title="Please give a valid Password"
					/>
				</Form.Field>
				<a href="./reset" class="text-xs text-primary hover:underline">Reset Password</a>
			</div>

			<div class="space-y-3">
				<Button type="submit" class="btn btn-outline w-full">Sign In</Button>
				<Oauth />
			</div>
		</Form.Root>

		<p class="text-center text-xs text-muted-foreground">
			Don't have an account?
			<a href="./signup" class="text-primary hover:underline">Sign up</a>
		</p>
	</div>
</div>
