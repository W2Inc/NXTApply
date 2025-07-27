<script>
	import Input from "$lib/ui/input.svelte";
	import { Home } from "@lucide/svelte";

</script>
<form class="max-w-16">
	<label>
		Text:
		<Input type="text" icon={Home} class="h-6" />
	</label>
	<br />

	<label>
		Number:
		<Input type="number" />
	</label>
	<br />

	<label>
		Password:
		<Input type="password" />
	</label>
	<br />

	<label>
		Email:
		<Input type="email" />
	</label>
	<br />

	<label>
		Checkbox:
		<Input type="checkbox" />
	</label>
	<br />

	<label>
		Radio 1
		<Input type="radio" name="radio" value="one" />
	</label>
	<label>
		Radio 2
		<Input type="radio" name="radio" value="two" />
	</label>
	<br />

	<label>
		Select:
		<select>
			<option value="">Choose...</option>
			<option value="option1">Option 1</option>
			<option value="option2">Option 2</option>
		</select>
	</label>
	<br />

	<label>
		Textarea:
		<textarea></textarea>
	</label>
	<br />

	<label>
		Date:
		<Input type="date" />
	</label>
	<br />

	<label>
		Color:
		<Input type="color" />
	</label>
	<br />

	<label>
		Range:
		<Input type="range" min="0" max="100" />
	</label>
	<br />

	<label>
		File:
		<Input type="file" />
	</label>
</form>
