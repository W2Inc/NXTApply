<script lang="ts">
	import { ApplicationStepType } from '$lib/index.svelte';
	import Step from '$lib/ui/track/step.svelte';
	import { track } from '$lib/ui/track/track.svelte';

	track.steps = Object.entries(ApplicationStepType).map(([key, value], i) => ({
		id: '',
		trackId: '',
		order: i,
		content: null,
		conditionals: {},
		createdAt: new Date(),
		type: value,
		updatedAt: new Date()
	}));

	let draggedIndex: number | null = $state(null);

	function handleDragStart(e: DragEvent, index: number) {
		draggedIndex = index;
		e.dataTransfer?.setData('text/plain', String(index));
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index) return;

		const updated = [...track.steps];
		const [moved] = updated.splice(draggedIndex, 1);
		updated.splice(index, 0, moved);

		// Update order to match new indices
		updated.forEach((step, idx) => {
			step.order = idx;
		});

		// Re-assign for reactivity
		track.steps = updated;
		draggedIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
	}
</script>

<div class="mx-auto flex max-w-[40rem] flex-col gap-2">
	{#each track.steps as step, i}
		<Step
			bind:step={track.steps[i]}
			draggable="true"
			ondragstart={(e) => handleDragStart(e, i)}
			ondragover={handleDragOver}
			ondrop={(e) => handleDrop(e, i)}
			ondragend={handleDragEnd}
		/>
	{/each}
</div>
