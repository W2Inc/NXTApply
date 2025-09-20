<script lang="ts">
	import { page } from '$app/state';
	import {
		CalendarDateTime,
		DateFormatter,
		type DateValue,
		toCalendarDate,
		toCalendarDateTime,
		CalendarDate
	} from '@internationalized/date';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { buttonVariants } from './ui/button';
	import { CalendarIcon } from '@lucide/svelte';
	import { Calendar } from '$lib/components/ui/calendar';
	import Button from './ui/button/button.svelte';
	import * as Tabs from './ui/tabs';

	interface Props {
		name?: string;
		value?: DateValue;
		format?: 'date' | 'datetime';
		minValue?: DateValue;
		maxValue?: DateValue;
	}

	let contentRef = $state<HTMLElement | null>(null);

	let { name, minValue, format = 'datetime', maxValue, value = $bindable() }: Props = $props();

	const hasTime = $derived(format === 'datetime');
	const formatter = $derived(
		new DateFormatter(page.data.locale, {
			dateStyle: 'long',
			timeStyle: hasTime ? 'short' : undefined
		})
	);

	let date = $state(
		value ? toCalendarDateTime(new CalendarDate(value.year, value.month, value.day)) : undefined
	);
	let mode = $state('am');
	let hour = $state(format === 'datetime' && value ? value.hour : 0);
	let minute = $state(format === 'datetime' && value ? value.minute : 0);

	$effect(() => {
		if (!date) {
			value = undefined;
			return;
		}
		let h = hour;
		if (mode === 'pm' && h < 12) h += 12;
		if (mode === 'am' && h === 12) h = 0;
		value = new CalendarDateTime(date.year, date.month, date.day, h, minute);
	});
</script>

{#if date}
	<input
		{name}
		type="hidden"
		value={format === 'datetime'
			? toCalendarDateTime(date).toString().replace(/:00$/, '')
			: toCalendarDate(date).toString()}
	/>
{/if}
<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'flex-1 justify-start text-left font-normal'
			}),
			!value && 'text-muted-foreground'
		)}
	>
		<CalendarIcon />
		{value ? formatter.format(value.toDate(page.data.tz)) : 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="flex w-auto self-start p-0">
		<div class="flex">
			<!-- Calendar Section: spans two rows in column 1 -->
			<Calendar
				type="single"
				bind:value={date}
				captionLayout="dropdown"
				class="h-full w-full flex-1"
				{minValue}
				{maxValue}
			/>

			<!-- Time Picker Section: column 2, row 1 -->
			{#if format === 'datetime'}
				<div class="flex flex-col border-l">
					<div class="flex h-full flex-1 items-center justify-center border-b">
						<div class="flex w-full items-stretch gap-2 px-2">
							<!-- Hour Selector -->
							<div class="relative flex-1">
								<span class="flex justify-center pb-2 text-xs">Hour</span>
								<div
									class="scrollbar-hide h-52 w-full snap-y snap-mandatory overflow-y-scroll"
									style="scroll-behavior:smooth;"
								>
									{#each Array.from({ length: 12 }, (_, i) => i + 1) as h, i}
										<Button
											type="button"
											variant="ghost"
											onclick={(_) => (hour = h)}
											class={cn(
												'flex h-8 w-full snap-center items-center justify-center text-base',
												h === hour && 'bg-muted'
											)}
										>
											{h.toString().padStart(2, '0')}
										</Button>
									{/each}
								</div>
							</div>

							<div class="relative flex-1">
								<span class="flex justify-center pb-2 text-xs">Minute</span>
								<div
									class="scrollbar-hide h-52 w-full snap-y snap-mandatory overflow-y-scroll"
									style="scroll-behavior:smooth;"
								>
									{#each Array.from({ length: 60 }, (_, i) => i) as m, i}
										<Button
											type="button"
											variant="ghost"
											onclick={(_) => (minute = m)}
											class={cn(
												'flex h-8 w-full snap-center items-center justify-center text-base',
												m === minute && 'bg-muted'
											)}
										>
											{m.toString().padStart(2, '0')}
										</Button>
									{/each}
								</div>
							</div>
						</div>
					</div>

					<!-- AM/PM Selector: column 2, row 2 -->
					<Tabs.Root bind:value={mode} class="p-2">
						<Tabs.List class="w-full">
							<Tabs.Trigger value="am">AM</Tabs.Trigger>
							<Tabs.Trigger value="pm">PM</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
				</div>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
