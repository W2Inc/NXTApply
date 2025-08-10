import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();

	// 1. Check the step condition
	// - If Boarding, if the user has filled in all the needed details, mark it as complete, and redirect to trigger switchboard
};
