<script lang="ts">
	import {
		UserCircle,
		ShieldCheck,
		HelpingHand
	} from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import Theme from '$lib/components/theme.svelte';
	import Language from '$lib/components/language.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import { signout } from '../auth/auth.remote';

	const { children, data }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col bg-background">
	<header class="border-b bg-card shadow-sm">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<a class="flex items-center space-x-3" href="/">
				<img src="/favicon.svg" alt="Logo" class="h-8 w-8" />
				<span class="text-lg font-semibold tracking-tight">{PUBLIC_APP_NAME}</span>
			</a>

			<div class="flex items-center gap-1.5">
				<Theme />
				<Language />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
						<UserCircle />
						Account
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>
								{data.user.firstName ?? 'My Account'}
							</DropdownMenu.Label>
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
			</div>
		</div>
		<div id="subheader"></div>
	</header>

	<!-- Main Content -->
	<main class="flex-1">
		<div class="container mx-auto max-w-3xl">
			{@render children?.()}
		</div>
	</main>
</div>
