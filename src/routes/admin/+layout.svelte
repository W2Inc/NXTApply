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
		X,
		Route,
		ChartLine,
		Mail,
		WavesLadder
	} from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import Theme from '$lib/ui/theme.svelte';
	import Dropdown from '$lib/ui/dropdown.svelte';
	import Language from '$lib/ui/language.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { page } from '$app/state';

	// Navigation items
	const navItems = [
		{ name: 'Dashboard', icon: Home, href: '/admin' },
		{ name: 'Users', icon: Users, href: '/admin/resources/users' },
		{ name: 'Tracks', icon: Route, href: '/admin/resources/tracks' },
		{ name: 'Analytics', icon: ChartLine, href: '/admin/analytics' },
		{ name: 'Emails', icon: Mail, href: '/admin/emails' },
		{ name: 'Events', icon: WavesLadder, href: '/admin/resources/events' }
	];

	let sidebarOpen = $state(false);
	const { data, children }: LayoutProps = $props();
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
					<img src="/favicon.svg" alt="Logo" class="h-8 w-8" />
					<span class="hidden text-lg font-semibold tracking-tight sm:inline-block">
						{PUBLIC_APP_NAME}
					</span>
				</div>
			</div>

			<div class="flex items-center">
				<Theme />
				<Language />
				<Dropdown>
					{#snippet trigger(open)}
						<div
							class="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full"
						>
							<span class="text-sm font-medium">A</span>
						</div>
						<div class="hidden text-left md:block">
							<p class="text-sm font-medium">Administrator</p>
						</div>
					{/snippet}
					<a
						href="/profile"
						class="hover:bg-accent hover:text-accent-foreground flex items-center px-4 py-2 text-sm transition-colors"
					>
						<User size={16} class="mr-2" />
						<span>Profile</span>
					</a>
					<hr />
					<form method="POST" action="/auth/sign-out">
						<button
							class="hover:bg-accent hover:text-accent-foreground flex w-full items-center px-4 py-2 text-sm transition-colors"
						>
							<LogOut size={16} class="mr-2" />
							<span>Logout</span>
						</button>
					</form>
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
			<div class="flex h-full flex-col p-4 sticky top-0">
				<div
					class="text-sidebar-foreground/60 mt-2 mb-4 text-xs font-medium tracking-wider uppercase"
				>
					Main Navigation
				</div>

				<nav class="space-y-1">
					{#each navItems as item}
						{@const active = page.url.pathname.endsWith(item.href)}
						<a
							href={item.href}
							class="hover:bg-sidebar-primary/10 flex items-center rounded-md px-3 py-2 transition-colors"
						>
							<svelte:component this={item.icon} size={18} class="mr-3" />
							<span>{item.name}</span>
							{#if active}
								<span class="bg-sidebar-primary ml-auto h-1.5 w-1.5 rounded-full"></span>
							{/if}
						</a>
					{/each}
				</nav>

				<!-- Spacer to push user info to bottom -->
				<div class="flex-grow"></div>
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
