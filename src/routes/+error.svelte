<script>
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, House, RefreshCw } from '@lucide/svelte';
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-md overflow-hidden rounded-xl border bg-card/90 shadow-xl backdrop-blur">
		<div class="overflow-hidden">
			<img class="w-full" src="https://http.cat/{page.status}" alt="error" />
		</div>

		<div class="space-y-6 p-6">
			<div class="space-y-2">
				<h2 class="text-2xl font-bold">{page.error?.message}</h2>
				<p class="text-muted-foreground">
					{#if page.status >= 500}
						<span class="font-medium">Silly cats!</span> Rest assured this issue has been logged & reported.
					{/if}
				</p>
			</div>

			<div class="flex gap-3">
				<Button variant="default" class="group flex-1" href="..">
					<ArrowLeft class="group-hover:shake mr-2 h-4 w-4 transition-transform" />
					Back
				</Button>

				<Button variant="outline" class="group" href={page.url.pathname}>
					<RefreshCw class="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
				</Button>
			</div>
		</div>
	</div>
</div>
