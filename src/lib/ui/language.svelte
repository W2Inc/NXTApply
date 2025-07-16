<script lang="ts">
	import { Moon, Sun, Computer, Languages } from '@lucide/svelte';
	import Button from './button.svelte';
	import { resetMode, setMode, theme } from 'mode-watcher';
	import Dropdown from './dropdown.svelte';
</script>

<Dropdown>
	{#snippet trigger()}
		<Languages size={18} />
	{/snippet}
	<Button type="button" variant="ghost" class="w-full justify-start gap-2">🇬🇧</Button>
	<Button type="button" variant="ghost" class="w-full justify-start gap-2">🇪🇸</Button>
	<Button type="button" variant="ghost" class="w-full justify-start gap-2">🇫🇷</Button>
	<Button type="button" variant="ghost" class="w-full justify-start gap-2">🇳🇱</Button>
</Dropdown>
