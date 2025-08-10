import type { PageServerLoad } from "./$types";

/** Stub to trigger layout load */
export const load: PageServerLoad = async ({ parent }) => await parent();
