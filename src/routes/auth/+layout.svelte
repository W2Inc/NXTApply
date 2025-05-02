<script lang="ts">
const { children } = $props();
</script>

<div class="h-dvh w-full lg:grid lg:grid-cols-[35rem_1fr]">
	<div id="body" class="flex items-center justify-center py-12">
		{@render children()}
	</div>
	<div id="image" class="hidden bg-muted lg:block">
		<img
			src="/placeholder.svg"
			alt="placeholder"
			width="1920"
			height="1080"
			class="h-full w-full object-cover"
		/>
	</div>
</div>
