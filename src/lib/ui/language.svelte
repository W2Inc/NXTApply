<script lang="ts">
	import { Languages } from '@lucide/svelte';
	import Button from './button.svelte';
	import Dropdown from './dropdown.svelte';

	function setLanguage(langCode: string) {
		document.cookie = `set-lang=${langCode}; path=/; SameSite=None; Secure`;
		window.location.reload();
	}
</script>

<Dropdown>
	{#snippet trigger()}
		<Languages size={18} />
	{/snippet}
	<div class="flex flex-col gap-2 p-1">
		<Button onclick={() => setLanguage('en')} class="text-2xl" type="button" variant="icon">🇬🇧</Button>
		<Button onclick={() => setLanguage('es')} class="text-2xl" type="button" variant="icon">🇪🇸</Button>
		<Button onclick={() => setLanguage('fr')} class="text-2xl" type="button" variant="icon">🇫🇷</Button>
		<Button onclick={() => setLanguage('nl')} class="text-2xl" type="button" variant="icon">🇳🇱</Button>
	</div>
</Dropdown>
