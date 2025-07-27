<script lang="ts">
	import type { ChallengeConditionals, ResultConditionals } from '$lib/types';
	import Input from '$lib/ui/input.svelte';
	import Select from '$lib/ui/select.svelte';
	import type { ApplicationStep } from '@prisma/client';
	import Documentation from '../documentation.svelte';
	import Fieldset from '../fieldset.svelte';

	interface Props {
		step: ApplicationStep;
	}

	let { step = $bindable() }: Props = $props();
	let unit = $state<'minutes' | 'hours'>('minutes');
	let points = $state<number>();
	let duration = $state<number>();

	$effect(() => {
		step.conditionals = {
			finishPoints: points,
			duration: duration ? { unit, value: duration } : undefined
		} as ChallengeConditionals;
	});


	function encodeHTMLToBase64(html: string | null): string {
		if (!html) return '';

		const encoded = btoa(unescape(encodeURIComponent(html)));
		return `data:text/html;base64,${encoded}`;
	}

	function decodeBase64ToHTML(dataUrl: string | null): string {
		if (!dataUrl) return '';

		const prefix = 'data:text/html;base64,';
		if (dataUrl.startsWith(prefix)) {
			const base64 = dataUrl.slice(prefix.length);
			return decodeURIComponent(escape(atob(base64)));
		}
		return '';
	}

</script>

<hr class="my-1 border border-t" />

<Documentation>
	<p class="text-muted-foreground">
		A challenge is essentially just that: it challenges the user with a puzzle. Your HTML Game <b
			class="text-primary font-semibold">must comply</b
		> with the documented specification, otherwise it will not work.
	</p>
	<hr class="border-muted my-2" />
	<p class="text-muted-foreground">
		You can optionally set a <span class="text-primary font-medium">max points</span> value. If the applicant
		gains this many points in this challenge, they automatically win and go to the next stage. If left
		empty, there is no limit.
	</p>
	<p class="text-muted-foreground">
		An optional <span class="text-primary font-medium">timer</span> can also be set to limit the amount
		of time on this challenge. If left empty, there is no timer applied.
	</p>
</Documentation>

<Fieldset title="HTML">
	<textarea
		bind:value={() => decodeBase64ToHTML(step.content), (v) => step.content = encodeHTMLToBase64(v)}
		class="border-input bg-background/80 text-foreground placeholder:text-muted-foreground focus:ring-primary/40 min-h-[4rem] w-full resize-y rounded-lg border px-4 py-3 font-sans text-xs transition focus:ring-2 focus:outline-none"
		placeholder="HTML Code..."
	></textarea>
</Fieldset>
<div class="flex flex-col gap-1">
	<div class="flex flex-col gap-2 sm:flex-row">
		<Fieldset title="Max Points">
			<Input
				id="points-input"
				type="number"
				class="h-6 text-xs"
				min="0"
				bind:value={points}
				placeholder="No Max Points"
			/>
		</Fieldset>
		<Fieldset title="Timer">
			<Input
				id="time-input"
				type="number"
				class="h-6 flex-1 text-xs"
				min="0"
				bind:value={duration}
				placeholder="No Limit"
			/>
			<Select bind:value={unit} class="text-xs">
				<option value="minutes">Minutes</option>
				<option value="hours">Hours</option>
			</Select>
		</Fieldset>
	</div>
</div>
