<script>
	import { page } from '$app/state';
</script>

<div>
	<img
		class="rounded"
		src="https://http.cat/{page.status}"
		alt="Something went wrong..."
		width="400px"
	/>

	<!-- <p class="text-muted-foreground text-sm">
		{#if page.status >= 500}
			Silly cats! Rest assured this issue has been logged & reported.
		{:else if page.status >= 400}
			{page.error?.message ?? "Oops! Something wasn't quite right with that request."}
		{/if}
	</p> -->
</div>

<style>
	div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		display: grid;
		place-items: center;
		gap: 1rem;
	}
</style>
