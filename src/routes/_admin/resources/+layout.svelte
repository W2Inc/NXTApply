<script lang="ts">
	import Input from '$lib/ui/input.svelte';
	import { Ellipsis, Search, Users } from '@lucide/svelte';
	import type { LayoutProps } from './$types';
	import Button from '$lib/ui/button.svelte';
	import Dropdown from '$lib/ui/dropdown.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';

	let search = $state('');
	const { children }: LayoutProps = $props();

	const url = $derived.by(() => {
		const params = new URLSearchParams(page.url.search);
		if (search) {
			params.set('q', search);
		} else {
			params.delete('q');
		}
		return `${page.url.pathname}?${params.toString()}`;
	});

	const navigate = () => goto(url, { invalidateAll: true });
</script>

<div class="container mx-auto max-w-[80rem]">
	{@render children?.()}
</div>
