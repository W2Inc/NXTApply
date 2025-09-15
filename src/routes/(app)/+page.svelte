<script>
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { FormKit } from '$lib/form.svelte';
	import { demo } from './app.remote';

	const form = FormKit.remote(demo);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

// What the enhance does is to basically handle onsubmits clearing the errors
<form {...form.remote}>
	<Checkbox name="name" value="YUP" />
	{#if form.errors.name}
		{#each form.errors.name as error}
			<span>{error}</span>
		{/each}
	{/if}
	<Checkbox name="Hello World2" />
	{JSON.stringify(form.errors)}
	<button>Submit</button>
</form>
