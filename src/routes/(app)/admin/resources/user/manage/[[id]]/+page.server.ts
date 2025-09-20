import { getUser } from "@/remotes/user/get.remote";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	return {
		user: getUser(params.id ?? '1')
	}
};
