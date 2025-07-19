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
	import teleport from '$lib/teleport.svelte';

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
	const { children }: LayoutProps = $props();
</script>

<!-- Secondary Bar - Application Progress -->
<div class="bg-muted sticky top-0 z-10 border-t" {@attach teleport("subheader")}>
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
						<span class="bg-primary ml-1 h-1.5 w-1.5 animate-pulse rounded-full"></span>
					{/if}
				</a>
			{/each}
		</nav>
	</div>
</div>

{@render children?.()}
