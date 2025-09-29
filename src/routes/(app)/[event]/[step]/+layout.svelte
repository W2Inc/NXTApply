<script lang="ts">
	import { Icon, UserPen, Coffee, Gamepad, Timer, CircleCheck } from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import { StepType } from '@prisma/client';
	import teleport from '$lib/teleport.svelte';

	const stepsRecord: Record<StepType, { icon: typeof Icon; label: string }> = {
		[StepType.BOARDING]: { icon: UserPen, label: 'Boarding' },
		[StepType.INTERMISSION]: { icon: Coffee, label: 'Break' },
		[StepType.CHALLENGE]: { icon: Gamepad, label: 'Challange' },
		[StepType.WAITING]: { icon: Timer, label: 'Waiting' },
		[StepType.RESULT]: {
			icon: CircleCheck,
			label: 'Completed'
		}
	};

	const { children, data }: LayoutProps = $props();

	const steps = $derived.by(() => {
		return data.steps.map((step) => {
			const stepData = stepsRecord[step.type];
			return {
				id: step.id,
				name: stepData.label,
				icon: stepData.icon
			};
		});
	});
</script>

<div class="sticky top-0 z-10 border-t bg-muted" {@attach teleport('subheader')}>
	<div class="container mx-auto px-4 py-2">
		<nav class=" flex items-center justify-between">
			{#each steps as stage, i}
				{#if i > 0}
					<hr class="flex-1" />
				{/if}
				<span
					class="flex items-center px-3 py-2 whitespace-nowrap {data.step.id === stage.id
						? 'font-medium text-primary'
						: 'text-muted-foreground hover:text-foreground'} transition-colors"
				>
					<stage.icon
						size={16}
						class={data.step.id === stage.id ? 'text-primary' : 'text-muted-foreground'}
					/>

					<span class="ml-2 hidden text-sm md:inline">{stage.name}</span>

					{#if data.step.id === stage.id}
						<span class="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></span>
					{/if}
				</span>
			{/each}
		</nav>
	</div>
</div>

{@render children?.()}
