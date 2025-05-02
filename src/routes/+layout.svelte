<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	let { children } = $props();
</script>

<Toaster duration={8000} />
{@render children()}
