<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { CircleCheck } from '@lucide/svelte';
	import { blur } from 'svelte/transition';
	import type { FormKit } from '$lib/form.svelte';

	const { form }: { form: ReturnType<typeof FormKit.remote> } = $props();
</script>

{#if form.message}
	<div transition:blur>
		<Alert.Root variant={form.status < 400 ? 'default' : 'destructive'}>
			<CircleCheck />
			<Alert.Title>{form.message}</Alert.Title>
		</Alert.Root>
	</div>
{/if}
