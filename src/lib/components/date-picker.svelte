<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		GregorianCalendar,
		toCalendar,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { page } from '$app/state';

	interface Props {
		name?: string;
		value?: DateValue;
		minValue?: DateValue | undefined;
		maxValue?: DateValue | undefined;
	}

	let { name, minValue, maxValue, value = $bindable() }: Props = $props();
	let contentRef = $state<HTMLElement | null>(null);
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
</script>

<input {name} type="hidden" value={value?.toDate(page.data.tz).toISOString()} />
<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'justify-start text-left font-normal'
			}),
			!value && 'text-muted-foreground'
		)}
	>
		<CalendarIcon />
		{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto self-start p-0">
		<Calendar type="single" bind:value captionLayout="dropdown" {minValue} {maxValue} />
	</Popover.Content>
</Popover.Root>
