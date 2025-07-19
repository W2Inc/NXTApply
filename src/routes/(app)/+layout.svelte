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
		Menu,
		Settings,
		CircleQuestionMark,
		ShieldUser
	} from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import Button from '$lib/ui/button.svelte';
	import Dropdown from '$lib/ui/dropdown.svelte';
	import Theme from '$lib/ui/theme.svelte';
	import Language from '$lib/ui/language.svelte';

	let userName = 'John Doe';

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

			<div class="flex items-center gap-2">
				<Theme />
				<Language />
				<Dropdown>
					{#snippet trigger(open)}
						<div class="flex items-center gap-2">
							<span>{userName}</span>
							<ChevronDown
								size={16}
								class="text-muted-foreground hidden transition-transform sm:block {open
									? 'rotate-180'
									: ''}"
							/>
						</div>
					{/snippet}
					<div class="w-48">
						<Button variant="ghost" class="w-full justify-start rounded-none">
							<CircleQuestionMark class="mr-2" size={18} />
							Assistance
						</Button>
						<Button variant="ghost" class="w-full justify-start rounded-none">
							<ShieldUser class="mr-2" size={18} />
							Data Privacy
						</Button>
						<hr />
						<Button variant="ghost" class="w-full justify-start rounded-none">
							<LogOut class="mr-2" size={18} />
							Logout
						</Button>
					</div>
				</Dropdown>
			</div>
		</div>
		<div id="subheader"></div>
	</header>

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
