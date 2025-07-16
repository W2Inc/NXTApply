<script lang="ts">
	import {
		User,
		LogOut,
		ChevronDown,
		FileText,
		GraduationCap,
		Home,
		BookOpen,
		CheckCircle,
		CreditCard,
		Menu
	} from '@lucide/svelte';
	import type { LayoutProps } from '../../$types';
	import Button from '$lib/ui/button.svelte';

	let userName = 'John Doe';

	// Define application stages
	const stages = [
		{ id: 'personal', name: 'Personal Info', icon: User, href: '/personal' },
		{ id: 'education', name: 'Education', icon: GraduationCap, href: '/education' },
		{ id: 'documents', name: 'Documents', icon: FileText, href: '/documents' },
		{ id: 'courses', name: 'Course Selection', icon: BookOpen, href: '/courses' },
		{ id: 'payment', name: 'Payment', icon: CreditCard, href: '/payment' },
		{ id: 'complete', name: 'Complete', icon: CheckCircle, href: '/complete' }
	];

	// Current active stage (this would come from your route or store)
	let activeStage = 'personal';

	// Logo URL
	let logoUrl = '/favicon.svg';
	let appName = 'Student Portal';

	// Mobile menu state
	let userMenuOpen = $state(false);

	const { children }: LayoutProps = $props();
</script>

<svelte:document onclick={() => userMenuOpen && (userMenuOpen = false)} />

<div class="bg-background flex min-h-screen flex-col">
	<!-- Top Header Bar -->
	<header class="bg-card border border-b shadow-sm">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<!-- Logo and App Name -->
			<div class="flex items-center space-x-3">
				<img src={logoUrl} alt="Logo" class="h-8 w-8" />
				<span class="text-lg font-semibold tracking-tight">{appName}</span>
			</div>

			<!-- User Menu -->
			<div class="relative" id="user-menu">
				<details class="group" bind:open={userMenuOpen}>
					<summary class="flex cursor-pointer list-none items-center space-x-2">
						<div class="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
							<User size={18} />
						</div>
						<span class="hidden text-sm font-medium sm:inline select-none">{userName}</span>
						<ChevronDown
							size={16}
							class="text-muted-foreground transition-transform group-open:rotate-180"
						/>
					</summary>

					<div
						class="bg-popover absolute right-0 z-[999] mt-2 w-48 rounded-md border py-2 shadow-md"
					>
						<Button variant="ghost" class="w-full justify-start">
							<LogOut size={16} class="mr-2" />
							<span>Settings</span>
						</Button>
						<hr />
						<Button variant="ghost" class="w-full justify-start hover:bg-destructive hover:text-destructive-foreground">
							<LogOut size={16} class="mr-2" />
							<span>Logout</span>
						</Button>
					</div>
				</details>
			</div>
		</div>
	</header>

	<!-- Secondary Bar - Application Progress -->
	<div class="bg-muted border sticky top-0 z-10 border-b">
		<div class="container mx-auto px-4 py-2">
			<nav class=" flex items-center justify-between">
				{#each stages as stage, i}
					{#if i > 0}
						<hr class="flex-1" />
					{/if}
					<a
						href={stage.href}
						class="flex items-center px-3 py-2 whitespace-nowrap {activeStage === stage.id
							? 'text-primary font-medium'
							: 'text-muted-foreground hover:text-foreground'} transition-colors"
					>
						<stage.icon
							size={16}
							class={activeStage === stage.id ? 'text-primary' : 'text-muted-foreground'}
						/>

						<span class="ml-2 hidden text-sm md:inline">{stage.name}</span>

						{#if activeStage === stage.id}
							<span class="animate-pulse bg-primary ml-1 h-1.5 w-1.5 rounded-full"></span>
						{/if}
					</a>
				{/each}
			</nav>
		</div>
	</div>

	<!-- Main Content -->
	<main class="flex-1">
		<!-- Content container with max width for better readability on large screens -->
		<div class="container mx-auto max-w-3xl">
			{@render children?.()}
		</div>
	</main>
</div>

<style>
	/* Hide scrollbar but keep functionality */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari and Opera */
	}
</style>
