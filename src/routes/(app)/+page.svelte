<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowRight, LogIn, User } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { Accordion, Button } from 'bits-ui';
	import { page } from '$app/state';

	let value = $state('item-1');
	const items = [
		{
			id: 'item-1',
			title: '2 Games',
			image: '/rocket.png',
			description: 'Complete two interactive logic games within a 2-hour window to demonstrate your problem-solving abilities.'
		},
		{
			id: 'item-2',
			title: 'Evaluation Period',
			image: '/break.png',
			description: 'Your performance is reviewed!. Successful candidates will proceed to the next stage of the process.'
		},
		{
			id: 'item-3',
			title: 'Piscine',
			image: '/piscine.png',
			description: "Select your kick off date for our intensive 'Piscine' program where you'll dive deep into hands-on learning."
		}
	];

	let beginAnimation = $state(false);
	$effect(() => {
		setTimeout(() => (beginAnimation = true), 300);
	});
</script>

{#snippet images()}
	<Accordion.Root
		type="single"
		orientation="horizontal"
		class="flex h-[400px] w-full gap-2 sm:flex-row"
		bind:value
	>
		{#each items as item (item.id)}
			<Accordion.Item
				value={item.id}
				class="ring-primary/70 relative cursor-pointer overflow-hidden rounded-lg transition-all duration-500 ease-in-out data-[state=closed]:w-[20%] data-[state=open]:w-[100%] md:data-[state=closed]:w-[10%] [&:has(:focus-visible)]:ring-2"
				onclick={() => (value = item.id)}
			>
				<img src={item.image} alt={item.title} class="h-[400px] w-full object-cover" />
				<div
					class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
				>
					<div
						class="transition-all duration-300 group-data-[state=closed]:translate-y-2 group-data-[state=open]:translate-y-0"
					>
						<Accordion.Header>
							<Accordion.Trigger
								class="focus-override text-left font-bold text-white transition-all duration-300 focus-visible:!outline-none data-[state=closed]:text-sm data-[state=closed]:opacity-0 data-[state=open]:mb-2 data-[state=open]:text-base data-[state=open]:opacity-100 md:data-[state=open]:text-xl"
							>
								{item.title}
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content
							forceMount
							class="max-h-0 overflow-hidden text-white/90 transition-all duration-700 data-[state=closed]:opacity-0 data-[state=open]:max-h-[100px] data-[state=open]:text-xs data-[state=open]:opacity-100 md:data-[state=open]:text-base"
						>
							{item.description}
						</Accordion.Content>
						<div
							class="absolute bottom-0 left-0 h-1 w-full transition-all duration-300 group-data-[state=closed]:opacity-0 group-data-[state=open]:opacity-100"
						></div>
					</div>
				</div>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
{/snippet}

<main class="overflow-hidden">
	<section
		class="bg-background dark:bg-background relative flex items-center overflow-hidden pt-32 pb-24 md:min-h-[calc(100vh-80px)]"
	>
		<div class="relative z-10 container mx-auto px-4 md:px-6">
			<div class="grid items-center gap-12 md:grid-cols-2 md:gap-8">
				{#if beginAnimation}
					<div class="flex flex-col space-y-6">
						<h1
							class="text-foreground text-4xl leading-tight font-bold md:text-5xl lg:text-6xl"
							in:fly={{ y: 50, delay: 400, duration: 700 }}
						>
							Start your next steps
						</h1>

						<p
							class="text-muted-foreground max-w-xl text-lg md:text-xl"
							in:fly={{ y: 50, delay: 600, duration: 700 }}
						>
							Manage your applications efficiently with our intuitive platform. Track progress,
							receive timely updates, and take control of your future.
						</p>

						<form method="post" use:enhance>
							<div class="flex flex-wrap gap-4 pt-4" in:fly={{ y: 50, delay: 1000, duration: 700 }}>
								<Button.Root class="btn" href="/{page.data.session?.userId}/boarding">
									Continue
									<ArrowRight class="ml-2 h-4 w-4" />
								</Button.Root>
							</div>
						</form>
					</div>
					<div in:fly={{ x: 50, delay: 1000, duration: 700 }}>
						{@render images()}
					</div>
				{/if}
			</div>
		</div>
	</section>
</main>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0) rotate(-12deg);
		}
		50% {
			transform: translateY(-10px) rotate(-8deg);
		}
	}

	@keyframes float-slow {
		0%,
		100% {
			transform: translateY(0) rotate(12deg);
		}
		50% {
			transform: translateY(-15px) rotate(16deg);
		}
	}

	@keyframes float-mock {
		0%,
		100% {
			transform: translateY(0) rotate(-1.5deg);
		}
		50% {
			transform: translateY(-10px) rotate(1.5deg);
		}
	}

	:global(.animate-float) {
		@media (prefers-reduced-motion: no-preference) {
			animation: float 4s ease-in-out infinite;
		}
	}

	:global(.animate-mock) {
		animation-delay: 250ms;
		@media (prefers-reduced-motion: no-preference) {
			animation: float-mock 10s ease-in-out infinite;
		}
	}

	:global(.animate-float-slow) {
		@media (prefers-reduced-motion: no-preference) {
			animation: float-slow 6s ease-in-out infinite;
		}
	}
</style>
