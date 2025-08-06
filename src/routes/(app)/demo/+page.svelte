<script>
	import { FormKit } from "$lib/form.svelte";
	import Button from "$lib/ui/button.svelte";
	import FormEntry from "$lib/ui/form/form-entry.svelte";
	import { testForm } from "./demo.remote";
	import Form from "./form.svelte";

</script>
<Form {...FormKit.remote(testForm)}>
	{@const errors = testForm.result?.errors}
	<FormEntry type="email" name="email" errors={errors?.email} />
	<FormEntry type="password" name="password" errors={errors?.password}/>
	<Button type="submit">Send</Button>
</Form>
