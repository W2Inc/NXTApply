import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	console.log("Hey")
	redirect(307, `/en/${locals.user?.id}/boarding`)
};
