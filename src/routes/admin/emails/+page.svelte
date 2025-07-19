<script lang="ts">
	import type { ApplicationTrack } from '@prisma/client';
	import type { PageProps } from './$types';

	// Fake data for demonstration
	const tracks: ApplicationTrack[] = [
		{
			id: '1',
			name: 'Standard Application',
			description: 'The default application track for new students.',
			isActive: true,
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-10')
		},
		{
			id: '2',
			name: 'Fast Track',
			description: 'Accelerated track for experienced applicants.',
			isActive: false,
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-10')
		}
	];

	const { data }: PageProps = $props();
</script>

{#snippet ApplicationTrackCard(track: ApplicationTrack)}
	<div
		class="bg-card text-card-foreground border-border flex flex-col gap-2 rounded-xl border p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
	>
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-bold">{track.name}</h2>
			<button
				class="bg-primary text-primary-foreground hover:bg-primary/80 rounded px-3 py-1 text-sm transition-colors"
				>Edit</button
			>
		</div>
		<p class="text-muted-foreground text-sm">{track.description ?? 'No description.'}</p>
		<div class="mt-2 flex items-center gap-2">
			<span class="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs"
				>{track.isActive ? 'Active' : 'Inactive'}</span
			>
			<span class="text-muted-foreground text-xs"
				>Created: {track.createdAt.toLocaleDateString()}</span
			>
		</div>
		<div
			class="bg-muted text-muted-foreground mt-3 flex h-24 w-full items-center justify-center rounded text-2xl"
		>
			🛤️
		</div>
	</div>
{/snippet}

<h1 class="mb-8 text-3xl font-bold">Application Tracks</h1>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	{#each tracks as track}
		{@render ApplicationTrackCard(track)}
	{/each}
	<div
		class="bg-card text-card-foreground border-primary hover:border-primary/70 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 shadow-md transition-colors duration-200"
	>
		<div
			class="bg-muted text-primary mb-3 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
		>
			+
		</div>
		<span class="text-lg font-semibold">Add New Track</span>
	</div>
</div>
