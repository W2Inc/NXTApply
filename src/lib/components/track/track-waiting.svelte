<script lang="ts">
	import type { ISO } from '$lib/utils';
	import type { ApplicationStep } from '@prisma/client';
	import Input from '../ui/input/input.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import * as Select from '../ui/select';
	import type { WaitingConditional } from './state.svelte';
	import { set } from '@/remotes/track/set.remote';

	interface Props {
		step: ISO<ApplicationStep>;
	}

	const { step }: Props = $props();
	const value = $state(0);
	const granularity = $state<WaitingConditional['granularity']>('hour');
	const conditional = $derived<WaitingConditional>({ value, granularity})
</script>

<!-- <input type="hidden" name={set.field(`steps`)} value={JSON.stringify(conditional)} /> -->

<p class="rounded border bg-card p-4 text-xs text-muted-foreground">
	Unlike intermission, this enforces a period of waiting. For example after completing everything
	you may want the applicant to wait for 1hour before getting the results or continue on to the next
	challenge.
</p>

<Separator class="my-2" />

<div class="flex gap-1">
	<Input type="number" placeholder="1"/>
	<Select.Root type="single">
		<Select.Trigger class="!h-8 w-[180px] bg-secondary/50 text-sm font-medium capitalize">
			<span class="truncate">{step.type.toLowerCase()}</span>
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label class="text-xs font-medium">Step Types</Select.Label>
				{#each ['hour', 'minute', 'day'] as type}
					<Select.Item value={type} label={type} class="capitalize">
						{type.toLowerCase()}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
