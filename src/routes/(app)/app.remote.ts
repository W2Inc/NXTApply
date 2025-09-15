import { getRequestEvent } from "$app/server";
import z from "zod";
import { FormKit } from "$lib/form.svelte";

const schema = z.object({
	name: z.string()
})

export const demo = FormKit.declare(schema, (data) => {
	const event = getRequestEvent();
	return FormKit.Reply.Ok({ Sure: 1 });
});

// export const demo = FormKit.declare(async data => {
// 	const event = getRequestEvent();
// 	Logger.dbg(JSON.stringify(Object.fromEntries(event.url.searchParams.entries())));
// 	const lel = await FormKit.parse(data, schema, );
// 	Logger.dbg(JSON.stringify(lel));
// 	return { result: lel.success };
// });
