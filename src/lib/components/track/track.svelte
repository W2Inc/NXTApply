<script lang="ts">
	import { useDragAndDrop } from '$lib/dnd.svelte';
	import { cn, UTC, type ISO } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import Fieldset from '../fieldset.svelte';
	import { TRACK_KEY, type CombinedTrack } from './state.svelte';
	import { StepType, type ApplicationStep } from '@prisma/client';
	import { getContext, type Component } from 'svelte';
	import TrackBoarding from './track-boarding.svelte';
	import { ClipboardList, GripVertical, PlusCircle, Save, Trash, X } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import * as Select from '../ui/select';
	import { set } from '@/remotes/track/set.remote';
	import TrackChallenge from './track-challenge.svelte';
	import TrackWaiting from './track-waiting.svelte';
	import TrackResult from './track-result.svelte';
	import TrackIntermission from './track-intermission.svelte';

	interface Props {
		class?: string;
	}

	const { class: klass }: Props = $props();
	const steps: Record<StepType, Component<{ step: ISO<ApplicationStep> }>> = {
		BOARDING: TrackBoarding,
		INTERMISSION: TrackIntermission,
		CHALLENGE: TrackChallenge,
		WAITING: TrackWaiting,
		RESULT: TrackResult
	};

	const track = getContext<CombinedTrack | null>(TRACK_KEY);
	const dnd = useDragAndDrop(track?.steps ?? []);

	const unique = new Set<StepType>(['BOARDING', 'RESULT']);
	const types = $derived.by(() =>
		Object.values(StepType).filter((type) => {
			if (!unique.has(type)) return true;
			return !dnd.items.some((step) => step.type === type);
		})
	);

	function addStep() {
		const date = UTC.write(UTC.now());
		dnd.items.push({
			id: 'n/a',
			trackId: 'n/a',
			type: 'BOARDING',
			order: dnd.items.length + 1,
			content: null,
			conditionals: null,
			createdAt: date,
			updatedAt: date
		});
	}
</script>

<Fieldset title="Track" class={cn('flex-1', klass)}>
	{#if dnd.items.length}
		<div class="flex items-center gap-2">
			<Button variant="outline" onclick={addStep}>
				<PlusCircle />
				Add Step
			</Button>
			<Button type="submit" variant="outline">
				<Save />
				Save
			</Button>
			{#if track?.id}
				<Button
					type="submit"
					variant="outline"
					class="ml-auto hover:bg-destructive hover:text-destructive-foreground"
				>
					<Trash />
					Delete
				</Button>
			{/if}
		</div>
		<Separator class="my-4" />

		<ul>
			{#each dnd.items as step, index (index)}
				<li
					{...dnd.draggable(index)}
					animate:flip={{ duration: 200 }}
					class="border bg-card p-4 transition-all not-first:border-t-0 first:rounded-t-md"
				>
					<input hidden type="number" name={set.field(`steps[${index}].order`)} />
					<div class="flex items-center gap-2 pb-2">
						<div class="cursor-grab rounded p-1 hover:bg-muted active:cursor-grabbing">
							<GripVertical class="h-4 w-4 text-muted-foreground" />
						</div>
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
						>
							{index + 1}
						</div>
						<Select.Root
							type="single"
							name={set.field(`steps[${index}].type`)}
							bind:value={() => step.type, (v) => (step.type = v)}
						>
							<Select.Trigger class="!h-8 w-[180px] bg-secondary/50 text-sm font-medium capitalize">
								<span class="truncate">{step.type.toLowerCase()}</span>
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label class="text-xs font-medium">Step Types</Select.Label>
									{#each types as type}
										<Select.Item value={type} label={type} class="capitalize">
											{type.toLowerCase()}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>

						<Separator class="flex-1" />

						<Button
							variant="outline"
							size="icon"
							onclick={() => dnd.items.splice(index, 1)}
							class="h-7 w-7 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
							title="Remove step"
						>
							<X class="h-4 w-4" />
						</Button>
					</div>

					{#if steps[step.type]}
						{@const Component = steps[step.type]}
						<Component {step} />
					{:else}
						<div class="text-sm text-muted-foreground">Unknown step type: {step.type}</div>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<div
			class="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8"
		>
			<div class="rounded-full bg-card p-3">
				<ClipboardList class="h-8 w-8" />
			</div>
			<p class="font-medium">No steps in this track</p>
			<Button variant="outline" onclick={addStep}>
				<PlusCircle class="mr-2 h-4 w-4" />
				Add Step
			</Button>
		</div>
	{/if}
</Fieldset>

<style>
	:global(.over) {
		border-style: dashed;
	}
</style>
