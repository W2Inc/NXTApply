<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		CalendarDateTime,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		toCalendarDate,
		toCalendarDateTime,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { page } from '$app/state';
	import { Label } from './ui/label';
	import { Input } from './ui/input';

	interface Props {
		name?: string;
		value?: DateValue;
		format?: 'date' | 'datetime';
		minValue?: DateValue | undefined;
		maxValue?: DateValue | undefined;
	}

	let placeholder = $state(new CalendarDateTime(2024, 7, 10, 12, 30, 0));
	let contentRef = $state<HTMLElement | null>(null);
	let { name, minValue, format = 'datetime', maxValue, value = $bindable() }: Props = $props();
	const formatter = $derived(
		new DateFormatter(page.data.locale, {
			dateStyle: 'long',
		})
	);

	// Helper to get time string from value
	function getTimeString(val: DateValue | undefined) {
		if (!val) return '00:00:00';
		const d = val.toDate(getLocalTimeZone());
		return d.toTimeString().slice(0, 8);
	}

	// When time input changes, update value
	function onTimeInput(e: Event) {
		const t = (e.target as HTMLInputElement).value; // "HH:mm:ss"
		const [hour, minute, second] = t.split(':').map(Number);
		if (value) {
			// Only update if value is CalendarDateTime or CalendarDate
			if ('hour' in value) {
				value = value.set({ hour, minute, second });
			} else {
				// Convert CalendarDate to CalendarDateTime
				value = new CalendarDateTime(value.year, value.month, value.day, hour, minute, second);
			}
		} else {
			// No value yet, use placeholder date
			value = new CalendarDateTime(placeholder.year, placeholder.month, placeholder.day, hour, minute, second);
		}
	}

	const formValue = $derived.by(() => {
		if (!value) return undefined;
		if (format === 'datetime') {
			return toCalendarDateTime(value).toString();
		} else {
			return toCalendarDate(value).toString();
		}
	});
</script>

{#snippet date()}
	<Popover.Root>
		<Popover.Trigger
			class={cn(
				buttonVariants({
					variant: 'outline',
					class: 'justify-start text-left font-normal flex-1'
				}),
				!value && 'text-muted-foreground'
			)}
		>
			<CalendarIcon />
			{value ? formatter.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Popover.Trigger>
		<Popover.Content bind:ref={contentRef} class="w-auto self-start p-0">
			<Calendar
				type="single"
				bind:value
				bind:placeholder
				captionLayout="dropdown"
				{minValue}
				{maxValue}
			/>
		</Popover.Content>
	</Popover.Root>
{/snippet}

{#snippet time()}
	<div class="flex flex-col">
		<Input
			type="time"
			step="1"
			value={getTimeString(value)}
			oninput={onTimeInput}
			class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
		/>
	</div>
{/snippet}

<input {name} type="hidden" value={formValue} />
{#if format === 'date'}
	{@render date()}
{:else if format === 'datetime'}
	<div class="flex gap-2">
		{@render date()}
		{@render time()}
	</div>
{/if}
