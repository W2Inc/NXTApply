<script lang="ts">
	import type { ISO } from '$lib/utils';
	import type { ApplicationStep } from '@prisma/client';

	interface Props {
		step: ISO<ApplicationStep>;
	}

	const { step }: Props = $props();
</script>

<p class="rounded bg-card text-xs text-muted-foreground border p-4">
	A boarding step requires the user to input necessary informatin about themselves before they may
	continue.
</p>
