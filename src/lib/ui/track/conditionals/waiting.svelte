<script lang="ts">
	import type { ResultConditionals, WaitingConditional } from '$lib/types';
	import Input from '$lib/ui/input.svelte';
	import type { ApplicationStep } from '@prisma/client';
	import Fieldset from '../fieldset.svelte';
	import Select from '$lib/ui/select.svelte';
	import Documentation from '../documentation.svelte';
	import * as Date from '@internationalized/date';

	interface Props {
		step: ApplicationStep;
	}

	let { step = $bindable() }: Props = $props();

	let unit = $state<'minutes' | 'hours' | 'endOfMonth'>('minutes');
	let duration = $state<number | undefined>(undefined);
	const formatter = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	let month = $derived.by(() => {
		const end = Date.endOfMonth(Date.now(Date.getLocalTimeZone()));
		const atMidnight = end.set({
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		});

		return formatter.format(atMidnight.toDate());
	});

	let mode = $state<'time' | 'gender'>('time');

	$effect(() => {
		step.conditionals = {
			waitTime: duration
				? {
						unit,
						value: duration
					}
				: undefined
		} as WaitingConditional;
	});
</script>

<hr />

<Documentation>
	<p class="text-muted-foreground text-xs">
		User's can be asked to wait a certain time until they are allowed to continue. Leave it empty if
		you wish to not wait. In that case this block will do nothing.
	</p>
</Documentation>

<Fieldset title="Mode">
	<Select bind:value={mode}>
		<option value="time">Time Based</option>
		<!-- <option value="gender">Gender Based</option> -->
	</Select>
	<p class="text-muted-foreground text-xs self-center">
		The mode to use to determine the wait time.
	</p>
</Fieldset>

{#if mode === 'time'}
	<Fieldset title="Waiting Condition">
		<Select bind:value={unit}>
			<option value="minutes">Minutes</option>
			<option value="hours">Hours</option>
			<option value="endOfMonth">End of Month</option>
		</Select>
		{#if unit !== 'endOfMonth'}
			<Input type="number" min="0" bind:value={duration} placeholder="None" class="h-6 text-xs" />
		{:else}
			<p class="text-muted-foreground self-center text-xs">
				Example: {month.toString()}
			</p>
		{/if}
	</Fieldset>
{/if}
