<script lang="ts">
	import {
		User,
		LogOut,
		ChevronDown,
		Settings,
		Home,
		Users,
		FileText,
		BarChart3,
		Calendar,
		Bell,
		Moon,
		Sun,
		Menu,
		X
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';
	import Theme from '$lib/ui/theme.svelte';
	import Dropdown from '$lib/ui/dropdown.svelte';
	import Language from '$lib/ui/language.svelte';

	// User information
	const userName = 'W2Wizard';
	const userRole = 'Administrator';

	// Current date and time
	const currentDate = '2025-07-15 19:24:35';

	// Navigation items
	const navItems = [
		{ name: 'Dashboard', icon: Home, href: '/', active: true },
		{ name: 'Users', icon: Users, href: '/users', active: false },
		{ name: 'Reports', icon: FileText, href: '/reports', active: false },
		{ name: 'Analytics', icon: BarChart3, href: '/analytics', active: false },
		{ name: 'Calendar', icon: Calendar, href: '/calendar', active: false },
		{ name: 'Settings', icon: Settings, href: '/settings', active: false }
	];

	// App info
	const appName = 'Admin Portal';
	const logoUrl = '/favicon.svg';

	// State management
	let darkMode = $state(false);
	let sidebarOpen = $state(false);
	let userMenuOpen = $state(false);

	// Toggle dark mode
	function toggleDarkMode() {
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	// Close menus when clicking outside
	function handleClickOutside(event) {
		const userMenu = document.getElementById('user-menu');
		if (userMenu && !userMenu.contains(event.target)) {
			userMenuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);

		// Check system preference for dark mode
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			darkMode = true;
			document.documentElement.classList.add('dark');
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const { children }: LayoutProps = $props();
</script>

<div class="bg-background flex min-h-screen flex-col">
	<!-- Top Header Bar -->
	<header class="bg-card border-border sticky top-0 z-20 border-b shadow-sm">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<!-- Left side: Logo, App Name and Mobile Menu Toggle -->
			<div class="flex items-center space-x-4">
				<button class="text-foreground md:hidden" onclick={() => (sidebarOpen = !sidebarOpen)}>
					{#if sidebarOpen}
						<X size={20} />
					{:else}
						<Menu size={20} />
					{/if}
				</button>

				<div class="flex items-center space-x-3">
					<img src={logoUrl} alt="Logo" class="h-8 w-8" />
					<span class="hidden text-lg font-semibold tracking-tight sm:inline-block">{appName}</span>
				</div>
			</div>

			<div class="flex items-center space-x-4">
				<button class="hover:bg-muted relative rounded-full p-1">
					<Bell size={18} />
					<span class="bg-primary absolute top-0 right-0 h-2 w-2 rounded-full"></span>
				</button>

				<Theme />
				<Language />
				<Dropdown>
					{#snippet trigger(open)}
						<div
							class="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full"
						>
							<span class="text-sm font-medium">{userName.charAt(0)}</span>
						</div>
						<div class="hidden text-left md:block">
							<div class="text-sm font-medium">{userName}</div>
							<div class="text-muted-foreground text-xs">{userRole}</div>
						</div>
						<ChevronDown
							size={16}
							class="text-muted-foreground hidden transition-transform sm:block {userMenuOpen
								? 'rotate-180'
								: ''}"
						/>
					{/snippet}
					<div class="border-b px-4 py-2">
						<div class="text-sm font-medium">{userName}</div>
						<div class="text-muted-foreground text-xs">{userRole}</div>
					</div>
					<a
						href="/profile"
						class="hover:bg-accent hover:text-accent-foreground flex items-center px-4 py-2 text-sm transition-colors"
					>
						<User size={16} class="mr-2" />
						<span>Profile</span>
					</a>
					<a
						href="/settings"
						class="hover:bg-accent hover:text-accent-foreground flex items-center px-4 py-2 text-sm transition-colors"
					>
						<Settings size={16} class="mr-2" />
						<span>Settings</span>
					</a>
					<div class="my-1 border border-t"></div>
					<button
						class="hover:bg-accent hover:text-accent-foreground flex w-full items-center px-4 py-2 text-sm transition-colors"
					>
						<LogOut size={16} class="mr-2" />
						<span>Logout</span>
					</button>
				</Dropdown>
			</div>
		</div>
	</header>

	<div class="flex flex-1">
		<!-- Sidebar Navigation -->
		<aside
			class="bg-sidebar text-sidebar-foreground border-sidebar-border fixed top-16 bottom-0 z-10 w-64 flex-shrink-0 border-r transition-transform duration-300 ease-in-out md:sticky {sidebarOpen
				? 'translate-x-0'
				: '-translate-x-full md:translate-x-0'}"
		>
			<div class="flex h-full flex-col p-4">
				<div
					class="text-sidebar-foreground/60 mt-2 mb-4 text-xs font-medium tracking-wider uppercase"
				>
					Main Navigation
				</div>

				<nav class="space-y-1">
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center rounded-md px-3 py-2 {item.active
								? 'bg-sidebar-accent text-sidebar-accent-foreground'
								: 'hover:bg-sidebar-primary/10'} transition-colors"
						>
							<svelte:component this={item.icon} size={18} class="mr-3" />
							<span>{item.name}</span>
							{#if item.active}
								<span class="bg-sidebar-primary ml-auto h-1.5 w-1.5 rounded-full"></span>
							{/if}
						</a>
					{/each}
				</nav>

				<div
					class="text-sidebar-foreground/60 mt-8 mb-4 text-xs font-medium tracking-wider uppercase"
				>
					System
				</div>

				<nav class="space-y-1">
					<a
						href="/settings"
						class="hover:bg-sidebar-primary/10 flex items-center rounded-md px-3 py-2 transition-colors"
					>
						<Settings size={18} class="mr-3" />
						<span>Settings</span>
					</a>
				</nav>

				<!-- Spacer to push user info to bottom -->
				<div class="flex-grow"></div>

				<!-- Current User Information (Mobile Only) -->
				<div class="border-sidebar-border mt-auto border-t p-4 md:hidden">
					<div class="flex items-center space-x-3">
						<div
							class="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full"
						>
							<span class="text-sm font-medium">{userName.charAt(0)}</span>
						</div>
						<div>
							<div class="text-sm font-medium">{userName}</div>
							<div class="text-muted-foreground text-xs">{userRole}</div>
						</div>
					</div>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="bg-background min-w-0 flex-1">
			<!-- Overlay for mobile sidebar -->
			{#if sidebarOpen}
				<button
					class="fixed inset-0 z-0 bg-black/50 md:hidden"
					onclick={() => (sidebarOpen = false)}
				></button>
			{/if}

			<!-- Page content -->
			<div class="p-6">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>

<style>
	/* No need for scroll specific styles now */
</style>
