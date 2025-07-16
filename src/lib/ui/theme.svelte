<script lang="ts">
	import { Moon, Sun, Computer } from '@lucide/svelte';
	import Button from './button.svelte';
	import { resetMode, setMode, theme } from 'mode-watcher';
	import Dropdown from './dropdown.svelte';
</script>

<Dropdown>
	{#snippet trigger()}
		{#if theme.current === 'light'}
			<Sun size={18} />
		{:else}
			<Moon size={18} />
		{/if}
	{/snippet}
	<Button
		type="button"
		variant="ghost"
		class="w-full justify-start gap-2"
		onclick={() => setMode('light')}
	>
		<Sun size={18} />
		Light
	</Button>
	<Button
		type="button"
		variant="ghost"
		class="w-full justify-start gap-2"
		onclick={() => setMode('dark')}
	>
		<Moon size={18} />
		Dark
	</Button>
	<hr />
	<Button
		type="button"
		variant="ghost"
		class="w-full justify-start gap-2"
		onclick={() => resetMode()}
	>
		<Computer size={18} /> System
	</Button>
</Dropdown>
