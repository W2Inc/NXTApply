<script lang="ts">
	import { page } from '$app/state';
	import { eventAction } from '@/remotes/event/act.remote';
	import { cn, ensure, UTC } from '$lib/utils';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { LogOut, Pause, Play, X } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import EventRequires from './event-requires.svelte';
	import EventDetails from './event-details.svelte';
	import type { ListedUserEvent } from './index.svelte';
	import EventStatus from './event-status.svelte';
	import { Modal } from '$lib/modal.svelte';
	import { isHttpError } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	interface Props {
		event: ListedUserEvent;
	}

	const { event }: Props = $props();
	const remote = $derived(eventAction.for(event.id));
	const action = $derived(event.userEventId ? 'leave' : 'join');

	const startsAt = $derived(UTC.read(event.startsAt, page.data.tz));
	const completedAt = $derived(UTC.read(event.completedAt, page.data.tz));
	const registerUntil = $derived(UTC.read(event.registerUntil, page.data.tz));

	const expired = $derived(UTC.now(page.data.tz).compare(startsAt) > 0);
	const cutoff = $derived(registerUntil ? UTC.now(page.data.tz).compare(startsAt) > 0 : false);
	const disabled = $derived(expired || !!completedAt || cutoff || !!event.requires);

	const enhanced = $derived(
		remote.enhance(async ({ form, submit }) => {
			form.inert = true;

			const leave = 'You may join this event again before it starts';
			const unique =
				'Once you start this event you are unable to leave it. You have to complete it.';
			const generic = 'You can leave the event at any point in time later before it starts.';

			const confirm = await Modal.confirm({
				title: `Are you sure you want to ${action} '${event.name}'`,
				message: event.unique ? unique : action === 'leave' ? leave : generic
			});

			if (confirm) {
				const [_, e] = await ensure(submit());
				if (isHttpError(e)) {
					toast.error(e.body.message);
				} else {
					toast.success('Success!');
				}
			}
			form.inert = false;
		})
	);
</script>

<form {...enhanced} class="flex gap-3">
	<input type="hidden" name={remote.field('id')} value={event.id} />
	<input type="hidden" name={remote.field('action')} value={action} />

	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					id="event-action"
					type="submit"
					{disabled}
					loading={remote.pending > 0}
					variant="outline"
					size="icon"
					class="size-12 hover:bg-accent"
				>
					{#if disabled}
						<X />
					{:else if action === 'leave'}
						<Pause />
					{:else if action === 'join'}
						<Play />
					{/if}
				</Button>
			{/snippet}
			<LogOut />
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>
				{#if action === 'join'}
					Join this event
				{:else}
					Leave this event
				{/if}
			</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<div class="flex flex-1 flex-col gap-1">
		<div class={cn('flex items-center gap-1', disabled && 'text-muted-foreground')}>
			<h4 class={cn(expired && 'line-through')}>{event.name}</h4>
			<EventRequires {event} />
			<EventStatus {event} />
		</div>
		<EventDetails {event} {startsAt} {expired} />
	</div>
</form>
