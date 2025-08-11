<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { ColumnDef } from '.';
	import { DateFormatter, fromDate } from '@internationalized/date';
	import { page as kitPage } from '$app/state';
	import { Button } from '../ui/button';
	import Badge from '../ui/badge/badge.svelte';

	interface PaginatedResult<T> {
		items: T[];
		page: number;
		next: boolean;
	}

	interface Props {
		data: T[] | PaginatedResult<T>;
		columns: ColumnDef<T>[];
		emptyMessage?: string;
		action?: Snippet<[item: T]>;
		onnext?: () => void;
		onprev?: () => void;
	}

	const {
		data,
		columns,
		action,
		emptyMessage = 'No data found.',
		onnext,
		onprev
	}: Props = $props();

	let items: T[] = $state([]);
	let page: number = $state(1);
	let next: boolean = $state(false);
	let isPaginated: boolean = $state(false);

	$effect(() => {
		if (Array.isArray(data)) {
			isPaginated = false;
		} else if (typeof data === 'object') {
			items = data.items;
			next = data.next;
			page = data.page;
			isPaginated = true;
		} else {
			items = [];
			isPaginated = false;
		}
	});

	const formatter = new DateFormatter(kitPage.data.locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
</script>

<div class="space-y-1">
	<div class="overflow-x-auto rounded-lg border">
		<table class="min-w-full bg-card text-card-foreground">
			<thead class="border-b">
				<tr>
					{#each columns as column}
						<th class="px-4 py-3 text-left text-xs font-semibold">{column.label}</th>
					{/each}
					{#if action}
						<th class="px-4 py-3 text-right text-xs font-semibold">Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each items as item}
					<tr class="border-b text-sm transition last:border-b-0 hover:bg-muted">
						{#each columns as column}
							<td class="px-4 py-3">
								{#if column.type === 'date'}
									{@render date(item, column)}
								{:else if column.type === 'years'}
									{@render years(item, column)}
								{:else if column.type === 'bool'}
									{@render bool(item, column)}
								{:else if column.key === 'id'}
									<code class="rounded bg-muted p-1 text-xs text-muted-foreground"
										>{item[column.key]}</code
									>
								{:else}
									{item[column.key] ?? '-'}
								{/if}
							</td>
						{/each}
						{#if action}
							<td class="px-4 py-3 text-end">
								{@render action(item)}
							</td>
						{/if}
					</tr>
				{/each}
				{#if items.length === 0}
					<tr>
						<td
							colspan={columns.length + (action ? 1 : 0)}
							class="px-4 py-6 text-center text-muted-foreground"
						>
							<span class="inline-flex items-center gap-2 text-sm">
								{emptyMessage}
							</span>
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	{#if isPaginated}
		<div class="mt-2 flex items-center gap-1">
			<Button
				class="h-7 text-xs select-none"
				variant="outline"
				onclick={onprev}
				disabled={page === 1 || !items.length}>Prev</Button
			>
			<Button class="h-7 text-xs select-none" variant="outline" onclick={onnext} disabled={!next}>
				Next
			</Button>
			<hr class="mx-2 flex-1" />
			<span class="text-xs">Page {page}</span>
		</div>
	{/if}
</div>

{#snippet bool(item: T, column: ColumnDef<T>)}
	{#if item[column.key]}
		<span class="inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
			Yes
		</span>
	{:else}
		<span class="inline-block rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
			No
		</span>
	{/if}
{/snippet}

{#snippet date(item: T, column: ColumnDef<T>)}
	{@const date = new Date(item[column.key] as any)}
	{formatter.format(date)}
{/snippet}

{#snippet years(item: T, column: ColumnDef<T>)}
	{#if item[column.key]}
		{@const year = new Date(item[column.key] as any).getFullYear()}
		{year}
		<span class="text-xs text-muted-foreground">
			({Math.abs(new Date().getFullYear() - year)})
		</span>
	{:else}
		-
	{/if}
{/snippet}
