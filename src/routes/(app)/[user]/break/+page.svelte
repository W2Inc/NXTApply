<script lang="ts">
	import { Coffee, ArrowRight } from '@lucide/svelte';
	import Button from '$lib/ui/button.svelte';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center space-y-8">
	<div class="flex flex-col items-center space-y-3">
		<Coffee size={48} class="text-amber-500" />
		<h1 class="text-center text-2xl font-bold">
			Take a short break! You've earned it.
		</h1>
		<p class="text-muted-foreground text-center">
			Rest your mind before continuing to the next stage of your application.
		</p>
	</div>
	<form method="POST">
		<Button>
			Continue to Next Stage
			<ArrowRight size={20} />
		</Button>
	</form>
</div>
