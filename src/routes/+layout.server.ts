import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
	return {
		locale: cookies.get("lang"),
	}
};
