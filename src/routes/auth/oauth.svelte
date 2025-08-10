<script lang="ts">
	import { Button } from "$lib/components/ui/button";

	const providers = ['github', 'google'];
</script>

<div>
	<div class="flex items-center gap-3">
		<hr class="grow" />
		<span class="text-muted-foreground w-min text-xs uppercase">or</span>
		<hr class="grow" />
	</div>

	<div class="flex gap-2 pt-2">
		{#each providers as provider, i}
			<Button class="size-12 grow p-3" variant="outline" href="/auth/provider/{provider}">
				<img src="/{provider}.svg" alt={`${provider} logo`} width="24" height="24" />
				{#if providers.length === 1}
					<span class="px-2">Sign in with <span class="capitalize">{provider}</span></span>
				{/if}
			</Button>
		{/each}
	</div>
</div>
