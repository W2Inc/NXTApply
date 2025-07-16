<script lang="ts">
	import { env } from '$env/dynamic/public';

	const { children } = $props();
</script>

<div class="min-h-dvh w-full lg:grid lg:grid-cols-[35rem_1fr]">
	<!-- Auth form side -->
	<div id="auth-container" class="flex flex-col justify-center px-6 py-12 lg:px-8">
		<div class="mb-8 flex justify-center">
			<a href="/" class="inline-flex items-center gap-2">
				<img src={env.PUBLIC_LOGO} alt="NXTApply" class="h-10 w-auto" />
				<span class="font-cal text-2xl font-semibold">NXTApply</span>
			</a>
		</div>

		<div class="mx-auto w-full max-w-md rounded border">
			{@render children()}
		</div>

		<div class="text-muted-foreground mt-6 text-center text-sm">
			<p>© {new Date().getFullYear()} NXTApply. All rights reserved.</p>
		</div>
	</div>

	<!-- Image side -->
	<div id="image" class="bg-muted hidden max-w-[100%] lg:block">
		<div
			style="background-image: url({env.PUBLIC_LOGIN_IMAGE});"
			class="relative h-full w-full bg-center bg-no-repeat bg-cover"
		>
			<div class="absolute bottom-8 left-8 max-w-md rounded p-2 text-white backdrop-blur-md bg-gray-400/10">
				<h2 class="mb-2 text-2xl font-bold">Start your journey with NXTApply</h2>
				<p class="text-sm opacity-90">
					Streamline your application process and discover opportunities tailored for you.
				</p>
			</div>
		</div>
	</div>
</div>
