<script lang="ts">
	import { Separator } from 'bits-ui';
	import type { LayoutProps } from './$types';
	import {
		UserPlus,
		GamepadIcon,
		Coffee,
		Clock,
		Hourglass,
		CheckCircle,
		XCircle,
		LogOut,
		Grid3X3,
		Rocket
	} from 'lucide-svelte';

	let { children, data }: LayoutProps = $props();

	// This would typically come from your auth store
	const userName = $derived.by(() => {
		const firstName = data.user.first_name || '';
		const lastName = data.user.last_name || '';

		if (!firstName && !lastName) return null;

		return [firstName, lastName].filter(Boolean).join(' ').trim() || null;
	});

	// Current stage (would be dynamic in your actual app)
	const currentStage = 'Boarding';

	const stages = [
		{ name: 'Boarding', icon: UserPlus },
		{ name: 'First Game', icon: Grid3X3 },
		{ name: 'Break', icon: Coffee },
		{ name: 'Second Game', icon: Rocket },
		{ name: 'Waiting', icon: Hourglass },
		{ name: 'Outcome', icon: CheckCircle }
	];
</script>

<!-- Main Layout -->
<div class="flex flex-col">
	<!-- Top navigation bar -->
	<header
		class="bg-background flex items-center justify-between border-b border-base-300 px-6 py-3"
	>
		<div class="text-xl font-bold">NXTApply</div>
		<div class="flex items-center gap-4">
			{#if userName}
				<span>{userName}</span>
			{/if}
			<button class="text-foreground-alt hover:bg-muted flex items-center gap-1 rounded px-2 py-1">
				<LogOut size={18} />
				<span>Logout</span>
			</button>
		</div>
	</header>

	<!-- Stages bar -->
	<nav
		class="bg-muted border-border-card flex items-center overflow-x-auto border-b border-base-300 px-6 py-4 md:px-12"
	>
		{#each stages as stage, i}
			{#if i !== 0}
				<Separator.Root class="divider flex-1" />
			{/if}
			<div
				class="relative flex items-center gap-2 px-2 py-2 md:px-4 {currentStage === stage.name
					? 'font-semibold text-accent'
					: 'text-base-300'}"
			>
				<stage.icon size={24} />
				<span class="hidden lg:inline">{stage.name}</span>
			</div>
		{/each}
	</nav>

	<!-- Main content -->
	<main class="flex-1">
		{@render children()}
	</main>
</div>
