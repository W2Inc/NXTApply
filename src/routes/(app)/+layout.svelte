<script lang="ts">
	import {
		ShieldCheck,
		Users,
		ChartArea,
		PartyPopper,
		CircleUser,
		CircuitBoard,
		TrainTrack,
		HandHelping
	} from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import Theme from '$lib/components/theme.svelte';
	import Language from '$lib/components/language.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
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
			href: '/admin/resources/user',
			icon: Users,
			label: 'Users'
		},
		{
			href: '/admin/resources/event',
			icon: PartyPopper,
			label: 'Events'
		},
		{
			href: '/admin/resources/track',
			icon: TrainTrack,
			label: 'Tracks'
		}
	];

	const isAdmin = $derived((data.user.flags & UserFlag.IsAdmin) !== 0);
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
						{#if isAdmin}
							<DropdownMenu.Group>
								<DropdownMenu.Label>Administrator</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a href="/admin" {...props}>
											<CircuitBoard />
											Dashboard
										</a>
									{/snippet}
								</DropdownMenu.Item>
								{#each adminMenu as nav (nav.label)}
									<DropdownMenu.Item>
										{#snippet child({ props })}
											{@const IconComponent = nav.icon}
											<a href={nav.href} {...props}>
												<IconComponent />
												{nav.label}
											</a>
										{/snippet}
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
						{/if}
						<DropdownMenu.Group>
							{#if !isAdmin}
								<DropdownMenu.Label>Account</DropdownMenu.Label>
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
											<HandHelping />
											Assistance
										</a>
									{/snippet}
								</DropdownMenu.Item>
								<DropdownMenu.Separator />
							{/if}
							<DropdownMenu.Item>
								{#snippet child(props)}
									<form {...signout}>
										<Button type="submit" {...props} variant="destructive" class="w-full">
											Logout
										</Button>
									</form>
								{/snippet}
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
		<div id="subheader"></div>
	</header>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children?.()}
	</main>
</div>
