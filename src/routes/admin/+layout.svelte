<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Button from '$lib/ui/button.svelte';
	import Dropdown from '$lib/ui/dropdown.svelte';
	import Language from '$lib/ui/language.svelte';
	import Theme from '$lib/ui/theme.svelte';
	import { ChevronDown, Home, LogOut, User } from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { cn } from '$lib/index.svelte';

	const { children }: LayoutProps = $props();
	const navigations = [
		{ href: '/admin', label: 'Home', icon: Home },
		{ href: '/admin/resources/users', label: 'Users', icon: User },
		{ href: '/admin/resources/events', label: 'Events', icon: User }
	];
</script>

<header class="bg-card border-b">
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		<a href="/admin" class="flex items-center space-x-3">
			<img src={env.PUBLIC_LOGO} alt="Logo" class="size-8" />
			<span class="text-lg font-semibold tracking-tight">Admin</span>
		</a>

		<div class="flex items-center">
			<Theme />
			<Language />
			<Dropdown>
				{#snippet trigger(open)}
					<div class="flex items-center gap-2">
						<User size={18} />
						<span class="hidden md:inline">Admin</span>
						<ChevronDown size={16} />
					</div>
				{/snippet}

				<form action="/auth/sign-out" method="POST">
					<Button type="submit" variant="ghost">
						<LogOut size={16} />
						Logout
					</Button>
				</form>
			</Dropdown>
		</div>
	</div>
</header>

<main class="flex">
	<aside class="bg-sidebar border-sidebar-border min-h-screen w-56 flex-shrink-0 border-r">
		<menu class="flex flex-col gap-2 px-2 py-6">
			{#each navigations as item}
				{@const current = page.url.pathname === item.href}
				<li>
					<Button class={'w-full justify-start gap-2'} variant="ghost" href={item.href}>
						<item.icon size={18} />
						<span>{item.label}</span>
						{#if current}
							<span class="ml-auto size-2 rounded-full bg-primary"></span>
						{/if}
					</Button>
				</li>
			{/each}
		</menu>
	</aside>
	<div class="p-6 min-w-0 flex-1">
		{@render children?.()}
	</div>
</main>
