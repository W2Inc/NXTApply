<script lang="ts">
	import type { ISO } from '$lib/utils';
	import type { ApplicationStep } from '@prisma/client';
	import { Input } from '../ui/input';
	import Separator from '../ui/separator/separator.svelte';
	import { Upload } from '@lucide/svelte';

	interface Props {
		step: ISO<ApplicationStep>;
	}

	const { step }: Props = $props();
</script>

<p class="rounded border bg-card p-4 text-xs text-muted-foreground">
	A challenge is a requirement step for the applicant. You provide a a single HTML file that is then
	displayed to the user. They then complete the challenge and their entry is recorded.
</p>

<Separator class="my-2" />

<div class="relative">
	<label
		for="file-upload"
		class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-background/50 transition-colors hover:bg-background/70"
	>
		<div class="flex flex-col items-center justify-center pt-5 pb-6">
			<Upload class="mb-2 h-6 w-6 text-muted-foreground" />
			<p class="mb-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
			<p class="text-xs text-muted-foreground">HTML file only</p>
		</div>
		<input
			id="file-upload"
			type="file"
			class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
			accept=".html"
		/>
	</label>
</div>
