<script lang="ts">
	import type { ISO } from '$lib/utils';
	import type { ApplicationStep } from '@prisma/client';

	interface Props {
		step: ISO<ApplicationStep>;
	}

	const { step }: Props = $props();
</script>

<p class="rounded border bg-card p-4 text-xs text-muted-foreground">
	A intermission step is basically giving the applicant a break / allows them to pause the process
	before they continue to the next step. For example after a lengthy challenge they might choose to
	either continue or give up.
</p>
