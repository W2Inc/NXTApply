<script lang="ts">
	import { ApplicationStepType, cn } from '$lib/index.svelte';
	import type { ApplicationStep } from '@prisma/client';
	import Button from '../button.svelte';
	import { ArrowRight, X } from '@lucide/svelte';
	import Result from './conditionals/result.svelte';
	import Boarding from './conditionals/boarding.svelte';
	import Challenge from './conditionals/challenge.svelte';
	import Waiting from './conditionals/waiting.svelte';
	import Select from '../select.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Alert from '../alert.svelte';
	import { dev } from '$app/environment';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		step: ApplicationStep;
	}

	let { step = $bindable(), ...rest }: Props = $props();
</script>

<div
	role="directory"
	class={cn(
		'group bg-card hover:border-primary relative flex cursor-grab flex-col gap-2 rounded-lg border p-2 shadow transition hover:shadow-md'
	)}
	{...rest}
>
	<div class="flex items-center justify-between">
		<div class="bg-muted/60 w-full flex items-center gap-3 rounded px-2 py-1">
			<span class="text-primary text-lg font-bold">
				<kbd class="bg-primary/10 rounded px-2 py-1">{step.order + 1}</kbd>
			</span>
			<Select class="min-w-[120px] text-sm" bind:value={() => step.type, (v) => (step.type = v)}>
				{#each Object.entries(ApplicationStepType) as [label, value]}
					<option {value}>{label}</option>
				{/each}
			</Select>
			<span class="ml-auto text-xs">
				Last Modified:
				{new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'short',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit'
				}).format(new Date(step.updatedAt))}
			</span>
		</div>
		<Button class="text-destructive" title="Remove step" variant="icon" onclick={() => {}}>
			<span class="sr-only">Remove step</span>
			<X size={16} />
		</Button>
	</div>
	<div class="flex flex-col gap-2 text-xs">
		{#key step.type}
			{#if step.type === ApplicationStepType.Challenge}
				<Challenge bind:step />
			{:else if step.type === ApplicationStepType.Result}
				<Result bind:step />
			{:else if step.type === ApplicationStepType.Boarding}
				<Boarding bind:step />
			{:else if step.type === ApplicationStepType.Waiting}
				<Waiting bind:step />
			{/if}
		{/key}
	</div>
	{#if dev}
		<details class="bg-muted rounded p-2 text-xs">
			<summary class="text-primary cursor-pointer font-semibold">Debug JSON</summary>
			<pre
				class="bg-background text-muted-foreground mt-2 overflow-x-auto rounded border p-2 text-[10px]">
				<code>{JSON.stringify(step, null, 2)}</code>
			</pre>
		</details>
	{/if}
</div>
