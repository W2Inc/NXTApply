<script lang="ts">
	import Input from "$lib/components/ui/input.svelte";
	import { Button, Separator } from "bits-ui";
import Phone from "lucide-svelte/icons/smartphone";
</script>

<form method="post" class="max-w-sm">
	<div class="flex flex-col justify-center gap-2 p-4">
		<div class="grid place-items-center gap-2">
			<Phone />
			<h1>Authentication code</h1>
		</div>
		<Input
			type="text"
			name="otp"
			id="otp"
			value=""
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
		<Button.Root type="submit" class="btn">Verify</Button.Root>
		<p>
			Open your two-factor authenticator (TOTP) app or browser extension to view your authentication
			code.
		</p>
	</div>
</form>
