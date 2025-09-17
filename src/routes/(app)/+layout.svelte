<script lang="ts">
	import {
		UserCircle,
		ShieldCheck,
		HelpingHand,
		ShieldUser,
		Menu,
		Users,
		ChartArea,
		PartyPopper,
		CircleUser
	} from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import Theme from '$lib/components/theme.svelte';
	import Language from '$lib/components/language.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { afterNavigate } from '$app/navigation';
	import { signout } from '@/remotes/auth/signout.remote';
	import { UserFlag } from '$lib';

	const { children, data }: LayoutProps = $props();
	const adminMenu = [
		{
			href: '/admin/analytics',
			icon: ChartArea,
			label: 'Analytics'
		},
		{
			href: '/admin/resources/users',
			icon: Users,
			label: 'Users'
		},
		{
			href: '/admin/resources/events',
			icon: PartyPopper,
			label: 'Events'
		}
	];

	let open = $state(false);
	afterNavigate(() => (open = false));
</script>

<div class="flex min-h-screen flex-col bg-background">
	<header class="border-b bg-card shadow-sm">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<a class="flex items-center space-x-3" href="/">
				<img src="/favicon.svg" alt="Logo" class="h-8 w-8" />
				<span class="text-lg font-semibold tracking-tight">{PUBLIC_APP_NAME}</span>
			</a>

			<div class="flex items-center gap-1">
				<Theme />
				<Language />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
						<CircleUser />
						<span class="hidden md:inline">Account</span>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>My Account</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a href="/gdpr" {...props}>
										<ShieldCheck />
										GDPR
									</a>
								{/snippet}
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a href="/help" {...props}>
										<HelpingHand />
										Assistance
									</a>
								{/snippet}
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								{#snippet child(props)}
									<form {...signout}>
										<Button type="submit" {...props} variant="destructive" class="w-full"
											>Logout</Button
										>
									</form>
								{/snippet}
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				{#if (data.user.flags & UserFlag.IsAdmin) === UserFlag.IsAdmin}
					<Separator orientation="vertical" class="min-h-6" />
					<Button href="/admin" variant="outline">
						<ShieldUser />
						<span class="hidden md:inline">Admin</span>
					</Button>
					<!-- <Separator orientation="vertical" class="min-h-6" /> -->
					<Sheet.Root bind:open>
						<Sheet.Trigger class={buttonVariants({ size: 'icon', variant: 'outline' })}>
							<Menu />
						</Sheet.Trigger>
						<Sheet.Content side="right" class="gap-0">
							<Sheet.Header>
								<Sheet.Title>Admin Navigation</Sheet.Title>
								<Sheet.Description>
									Navigate here to the different admin dashboards.
								</Sheet.Description>
							</Sheet.Header>
							<div class="grid flex-1 auto-rows-min gap-2 border-t px-1 py-2">
								{#each adminMenu as nav}
									{@const IconComponent = nav.icon}
									<Button variant="ghost" class="justify-start" href={nav.href}>
										<IconComponent size={48} />
										{nav.label}
									</Button>
								{/each}
							</div>
						</Sheet.Content>
					</Sheet.Root>
				{/if}
			</div>
		</div>
		<div id="subheader"></div>
	</header>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children?.()}
	</main>
</div>
