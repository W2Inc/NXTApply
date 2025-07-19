<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'svelte-sonner';
	const { children } = $props();
</script>

<ModeWatcher />
<Toaster duration={8000} richColors />

<svelte:window
	onclick={(e) => {
		const target = e.target as Element;
		const isDetailsClick = !!target.closest('details');
		if (!isDetailsClick) {
			document.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((details) => {
				details.open = false;
			});
		}
	}}
/>

{@render children()}
