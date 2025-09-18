<script lang="ts">
	import { page } from '$app/state';
	import { DateFormatter } from '@internationalized/date';
	import type { AvailableUserEvent } from './+page.server';
	import { FormKit } from '$lib/form.svelte';
	import { eventAction } from '@/remotes/event/act.remote';

	interface Props {
		event: AvailableUserEvent;
	}

	const { event }: Props = $props();
	const form = $derived(eventAction.for(event.id));
	const action = $derived(event.userEventId ? 'leave' : 'join');
	const formatter = new DateFormatter(page.data.locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
</script>

<form {...FormKit.toastify(form)} class="space-y-4">
	<input type="hidden" name={form.field('id')} value={event.id} />
	<input type="hidden" name={form.field('action')} value={action} />
	<button type="submit" class="p-4 bg-card rounded border">{action}</button>
</form>
