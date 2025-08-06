import { form } from "$app/server";
import z from "zod/v4";
import { FormKit } from "$lib/form.svelte";

const schema = z.object({
  email: z.email(),
  password: z.string().min(4),
});

export const testForm = form<FormKit.Output<typeof schema>>(async data => {
	await new Promise(resolve => setTimeout(resolve, 3000));
	const form = await FormKit.parse(data, schema)
	if (form.error) {
		return FormKit.invalid(form);
	}


	return FormKit.success({

	});
});
