<script lang="ts">
	import { setMode, theme } from 'mode-watcher';
	import { Moon, Sun, Computer, Languages } from '@lucide/svelte';
	import * as Select from '$lib/components/ui/select';
	import { buttonVariants } from './ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { locales } from 'virtual:wuchale/locales';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon">
				<Languages size={18} />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start">
		{#each Object.entries(locales) as [_, name]}
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<Button
						data-sveltekit-reload
						{...props}
						variant="ghost"
						class="block justify-start font-normal capitalize"
						href="?locale={name}"
					>
						{name}
					</Button>
				{/snippet}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
