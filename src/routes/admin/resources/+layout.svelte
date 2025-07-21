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

<div class="container mx-auto px-4 py-8">
	<div class="flex items-center gap-2">
		<Input type="text" icon={Search} bind:value={search} placeholder="Search" />
		<Button class="gap-2" onclick={navigate}>
			<Search size={16} />
			Search
		</Button>
		<hr class="flex-1 border-l" />
		<!-- <hr class="flex-1 border-l" />
		<div class="flex items-center gap-2">
			<Dropdown>
				{#snippet trigger()}
					<Ellipsis size={16} />
				{/snippet}
				<div class="w-[200px]">
					<Button
						type="button"
						variant="ghost"
						class="w-full justify-start gap-2 rounded-none"
						onclick={() =>
							fetch('/admin/users')
								.then((res) => res.blob())
								.then((blob) => {
									const url = window.URL.createObjectURL(blob);
									const a = document.createElement('a');
									a.href = url;
									a.download = 'users.csv';
									document.body.appendChild(a);
									a.click();
									a.remove();
									window.URL.revokeObjectURL(url);
								})}
					>
						<Users size={16} />
						Export All to CSV
					</Button>
				</div>
			</Dropdown>
		</div> -->
	</div>
	<hr class="my-2" />
	{@render children?.()}
</div>
