import { Switchboard } from "$lib/index.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, url, locals, params }) => {
	const { step } = await parent();
	return { step }
};
