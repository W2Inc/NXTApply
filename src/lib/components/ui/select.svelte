<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ChevronsUp from 'lucide-svelte/icons/chevrons-up';
	import ChevronsDown from 'lucide-svelte/icons/chevrons-down';
	import { Select, type WithoutChildren } from 'bits-ui';

	type Props = WithoutChildren<Select.RootProps> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		icon?: typeof Check;
		type?: 'single' | 'multiple';
	};

	let {
		value = $bindable(),
		items,
		contentProps,
		placeholder,
		icon: Icon,
		type = 'single',
		...restProps
	}: Props = $props();

	const selectedLabels = $derived.by(() => {
		if (!value) return '';

		if (type === 'multiple') {
			const valueArray = Array.isArray(value) ? value : [value];
			return valueArray.length
				? items
						.filter((item) => valueArray.includes(item.value))
						.map((item) => item.label)
						.join(', ')
				: '';
		} else {
			const singleValue = Array.isArray(value) ? value[0] : value;
			return items.find((item) => item.value === singleValue)?.label || '';
		}
	});
</script>

<Select.Root {type} onValueChange={(v) => (value = v)} {items} {...restProps}>
	<Select.Trigger class="select hover:border-accent flex w-full items-center justify-between">
		<span class="truncate">{selectedLabels || placeholder || 'Select...'}</span>
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="menu dropdown-content bg-base-100 border-base-300 z-[1] w-56 min-w-[var(--bits-select-anchor-width)] rounded border p-2 shadow-lg"
			sideOffset={10}
		>
			<Select.ScrollUpButton
				class="text-base-content/50 hover:text-base-content flex w-full items-center justify-center py-1"
			>
				<ChevronsUp class="size-4" />
			</Select.ScrollUpButton>
			<Select.Viewport class="max-h-60">
				{#each items as item, i (i + item.value)}
					<Select.Item
						class="data-[highlighted]:bg-base-200 data-[highlighted]:text-base-content flex cursor-pointer items-center rounded-md px-2 py-1.5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
						value={item.value}
						label={item.label}
						disabled={item.disabled}
					>
						{#snippet children({ selected })}
							<span class="truncate">{item.label}</span>
							{#if selected}
								<Check class="ml-auto size-4" aria-label="Selected" />
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton
				class="text-base-content/50 hover:text-base-content flex w-full items-center justify-center py-1"
			>
				<ChevronsDown class="size-4" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
