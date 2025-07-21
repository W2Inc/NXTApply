<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { ColumnDef } from '.';

	interface Props {
		data: T[];
		columns: ColumnDef<T>[];
		emptyMessage?: string;
		action?: Snippet<[item: T]>;
	}

	const { data, columns, action, emptyMessage = 'No data found.' }: Props = $props();
</script>

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
	{new Date(item[column.key] as any).toLocaleString()}
{/snippet}

{#snippet years(item: T, column: ColumnDef<T>)}
	{#if item[column.key]}
		{@const year = new Date(item[column.key] as any).getFullYear()}
		{year}
		<span class="text-muted-foreground text-xs">
			({Math.abs(new Date().getFullYear() - year)})
		</span>
	{:else}
		-
	{/if}
{/snippet}

<div class="overflow-x-auto rounded-lg border">
	<table class="bg-card text-card-foreground min-w-full">
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
			{#each data as item}
				<tr class="hover:bg-muted border-b text-sm transition last:border-b-0">
					{#each columns as column}
						<td class="px-4 py-3">
							{#if column.type === 'date'}
								{@render date(item, column)}
							{:else if column.type === 'years'}
								{@render years(item, column)}
							{:else if column.type === 'bool'}
								{@render bool(item, column)}
							{:else if column.key === 'id'}
								<code class="bg-muted text-muted-foreground rounded p-1 text-xs"
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
			{#if data.length === 0}
				<tr>
					<td colspan={columns.length + (action ? 1 : 0)} class="text-muted-foreground px-4 py-6 text-center">
						<span class="inline-flex items-center gap-2 text-sm">
							{emptyMessage}
						</span>
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
