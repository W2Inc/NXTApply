<script lang="ts">
	import Boarding from "./boarding.svelte";
	import type { PageData } from './$types';
	import { ApplicationStepType } from "$lib";

	const { data }: { data: PageData } = $props();
</script>

{#if data.step?.type === ApplicationStepType.Boarding}
	<Boarding />
{:else if data.step?.type === ApplicationStepType.Intermission}
	<Boarding />
{:else if data.step?.type === ApplicationStepType.Challenge}
	<Boarding />
{:else if data.step?.type === ApplicationStepType.Waiting}
	<Boarding />
{:else if data.step?.type === ApplicationStepType.Result}
	<Boarding />
{/if}
