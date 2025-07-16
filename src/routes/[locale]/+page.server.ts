import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	console.log("Figure out what to do with you.")
	redirect(302, `/${locals.user?.id}/boarding`)
};
