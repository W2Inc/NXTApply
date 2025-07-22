<script lang="ts">
	import { Coffee, ArrowRight } from '@lucide/svelte';
	import Button from '$lib/ui/button.svelte';
	import { onMount } from 'svelte';

	const facts = [
		"Bananas are berries, but strawberries aren't.",
		"A group of flamingos is called a 'flamboyance'.",
		"Honey never spoils.",
		"Octopuses have three hearts.",
		"Venus is the only planet that spins clockwise.",
		"Hot water freezes faster than cold water.",
		"Some turtles can breathe through their butts.",
		"Oxford University is older than the Aztec Empire.",
		"An ostrich's eye is bigger than its brain.",
		"Koalas have fingerprints.",
		"There's a basketball court on the top floor of the U.S. Supreme Court building.",
		"Sloths can hold their breath longer than dolphins.",
		"Sharks existed before trees.",
		"Butterflies taste with their feet.",
		"Humans share 60% of their DNA with bananas.",
		"There's a species of jellyfish that is immortal.",
		"Peanuts aren't nuts; they're legumes.",
		"Rainbows can appear at night, called 'moonbows'.",
		"Some cats are allergic to humans.",
		"Venus flytraps digest their prey in about 10 days.",
		"There's a town called 'Dull' in Scotland, paired with 'Boring' in Oregon.",
		"Cleopatra lived closer in time to the moon landing than to the building of the pyramids.",
		"Sea otters hold hands while sleeping.",
		"Tomatoes have more genes than humans.",
		"There's a species of ant that can heal wounds.",
		"Penguins propose to each other with pebbles.",
		"Goats have rectangular pupils.",
		"Some frogs freeze without dying.",
		"Humans are the only animals that blush.",
		"There's a cloud shaped like a morning glory in Australia.",
		"Apples float because they are 25% air.",
		"Starfish can regrow lost arms.",
		"There's a museum of failed products in Sweden.",
		"Bubble wrap was originally invented as wallpaper.",
		"Bees can recognize human faces.",
		"There's a species of spider that can fly.",
		"Potatoes were the first food grown in space.",
		"Elephants can't jump.",
		"There's a volcano in Indonesia that spews blue lava.",
		"Some fish cough.",
		"Antarctica is the only continent without reptiles.",
		"There's a lake in Australia that's naturally pink."
	];


	onMount(() => {
		setInterval(() => {
			index = Math.floor(Math.random() * facts.length);
		}, 2500);
	});

	let index = $state(Math.floor(Math.random() * facts.length));
	const fact = $derived(facts[index] ?? "Did you know? 42 is the answer to life, the universe, and everything!");
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
		<p class="text-muted-foreground text-center">
			{fact}
		</p>
	</div>
	<form method="POST">
		<Button>
			Continue to Next Stage
			<ArrowRight size={20} />
		</Button>
	</form>
</div>
