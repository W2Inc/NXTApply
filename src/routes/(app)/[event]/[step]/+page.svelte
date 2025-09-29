<script lang="ts">
	import Boarding from "./boarding.svelte";
	import type { PageData } from './$types';
	import { StepType } from "@prisma/client";

	const { data }: { data: PageData } = $props();
</script>

{#if data.step?.type === StepType.BOARDING}
	<Boarding />
{:else if data.step?.type === StepType.INTERMISSION}
	<Boarding />
{:else if data.step?.type === StepType.CHALLENGE}
	<Boarding />
{:else if data.step?.type === StepType.WAITING}
	<Boarding />
{:else if data.step?.type === StepType.RESULT}
	<Boarding />
{/if}