<script lang="ts">
	import type { ResultConditionals } from '$lib/types';
	import Input from '$lib/ui/input.svelte';
	import Select from '$lib/ui/select.svelte';
	import { Hourglass } from '@lucide/svelte';
	import type { ApplicationStep } from '@prisma/client';
	import { onMount } from 'svelte';
	import Fieldset from '../fieldset.svelte';
	import Documentation from '../documentation.svelte';
	import { track } from '../track.svelte';
	import Alert from '$lib/ui/alert.svelte';

	interface Props {
		step: ApplicationStep;
	}

	let { step = $bindable() }: Props = $props();
	let mode = $state<ResultConditionals['mode']>('points');
	let operator = $state<'>=' | '<=' | '==' | '<' | '>'>('>=');
	let value = $state<number>(0);
	const invalid = $derived(step.order !== track.steps.length - 1);


	$effect(() => {
		step.conditionals = {
			mode,
			points: mode === 'points' ? { operator, value } : undefined
		} as ResultConditionals;
	});
</script>

<hr />
<Documentation>
	<p class="text-muted-foreground text-xs">
		Lets you configure the final result after the applicant went through all stages. You can for
		example check if user has x amount of points collected from all challenges.
	</p>
</Documentation>
<Fieldset title="Result Condition">
	<Select bind:value={mode}>
		<option value="all-pass">All Pass</option>
		<option value="all-fail">All Fail</option>
		<option value="points">Points</option>
	</Select>
	{#if mode === 'points'}
		<Select bind:value={operator}>
			<option value=">=">&ge;</option>
			<option value="<=">&le;</option>
			<option value="==">==</option>
			<option value="<">&lt;</option>
			<option value=">">&gt;</option>
		</Select>
		<Input type="number" min="0" bind:value placeholder="Value" class="h-6 text-xs" />
	{/if}
</Fieldset>
{#if invalid}
	<hr />
	<Alert
		variant="error"
		title="Invalid Configuration"
		description="The step is currently invalid, try to move step into a different order or change it's configuration."
	/>
{/if}
