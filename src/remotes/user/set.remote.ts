import { form } from "$app/server";
import { FormKit } from "$lib/form.svelte";
import z from "zod";

const schema = z.object({
	id: z.string(),
	email: z.email(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phone: z.string().optional(),
	dob: z.string().optional(),
	gender: z.enum(['0', '1', '2', '3']).optional(),
	country: z.string().optional(),
});

export const set = form(schema, () => {
	return FormKit.Reply.NoContent();
});
