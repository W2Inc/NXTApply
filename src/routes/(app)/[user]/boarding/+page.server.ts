// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { z } from "zod/v4";
import type { Actions, PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { Formy, Switchboard, UserFlag } from "$lib/index.svelte";
import Form from "$lib/ui/form/form.svelte";

// ============================================================================

export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	firstName: z.string().min(1).max(50),
	lastName: z.string().min(1).max(50),
	gender: z.int().min(0).max(2),
	birthDate: z.date(),
	phone: z.string().optional(),
	email: z.email()
});

// ============================================================================


export const load: PageServerLoad = async ({ parent, url, locals, params }) => {
	const { step } = await parent();

	return {}
};

// ============================================================================

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const userId = locals.session?.userId ?? error(401, "Unauthorized");

		const result = await Formy.parse(request, schema);
		if (result.error) {
			return Formy.fail(400, result);
		}

		locals.db.run(
			`UPDATE users SET
				firstName = ?,
				lastName = ?
				WHERE id = ?`,
			[
				result.data.firstName,
				result.data.lastName,
				userId
			]
		);

		Switchboard.resolve(locals, userId, url);
	}
};