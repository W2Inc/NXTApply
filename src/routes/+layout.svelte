<script lang="ts">
	import '../app.css';
	import "driver.js/dist/driver.css";
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import Modal from '$lib/components/modal.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

<Modal />
<TooltipProvider>
	<Toaster richColors />
	<ModeWatcher />
	{@render children?.()}
</TooltipProvider>
