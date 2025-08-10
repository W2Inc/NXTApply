<script lang="ts">
	import { setMode, theme } from 'mode-watcher';
	import { Moon, Sun, Computer } from '@lucide/svelte';
	import * as Select from '$lib/components/ui/select';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon">
				<Sun size={18} />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start">
		<DropdownMenu.Item onSelect={(_) => setMode('light')}>Light</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(_) => setMode('dark')}>Dark</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(_) => setMode('system')}>System</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
