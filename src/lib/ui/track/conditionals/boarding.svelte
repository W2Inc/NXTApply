<script lang="ts">
	import type { BoardingConditional } from '$lib/types';
	import Input from '$lib/ui/input.svelte';
	import type { ApplicationStep } from '@prisma/client';
	import Fieldset from '../fieldset.svelte';
	import Documentation from '../documentation.svelte';
	import { Cake } from '@lucide/svelte';
	import Alert from '$lib/ui/alert.svelte';

	interface Props {
		step: ApplicationStep;
	}

	let min = $state<number>();
	let max = $state<number>();
	let { step = $bindable() }: Props = $props();

	const invalid = $derived(step.order !== 0);
	$effect(() => {
		step.conditionals = {
			age: min || max ? { min, max } : undefined
		} satisfies BoardingConditional;
	});
</script>

<hr />
<Documentation>
	<p class="text-muted-foreground text-xs">
		"Boarding" refers to onboarding users by collecting their basic information (e.g., date of
		birth, name). Optionally, set min/max age to restrict who can proceed.
	</p>
</Documentation>
<div class="flex items-center gap-2">
	<Fieldset title="Minimum Age">
		<Input
			icon={Cake}
			class="h-6 text-xs"
			id="min-age"
			type="number"
			min="0"
			max="100"
			placeholder="None"
			bind:value={min}
		/>
	</Fieldset>
	<Fieldset title="Maximum Age">
		<Input
			icon={Cake}
			class="h-6 text-xs"
			id="max-age"
			type="number"
			min="0"
			max="100"
			placeholder="None"
			bind:value={max}
		/>
	</Fieldset>
</div>
{#if invalid}
	<hr />
	<Alert
		variant="error"
		title="Invalid Configuration"
		description="The step is currently invalid, try to move step into a different order or change it's configuration."
	/>
{/if}
