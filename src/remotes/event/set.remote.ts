import { form } from "$app/server";
import { FormKit } from "$lib/form.svelte";
import z from "zod";

const schema = z.object({
	id: z.string(),
	address: z.string().optional(),
	maxUsers: z.coerce.number<string>().optional(),
	autoComplete: z.string().optional(),
	unique: z.string().optional(),
	eventTypeId: z.string(),
	trackId: z.string().optional(),
	startsAt: z.coerce.date<string>(),
	registerUntil: z.coerce.date<string>().optional(),
});

export const set = form(schema, async ({ }) => {
	return FormKit.Reply.NoContent();
});
