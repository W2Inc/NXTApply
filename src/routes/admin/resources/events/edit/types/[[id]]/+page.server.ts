// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error } from "@sveltejs/kit";
import type { EventType } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import z from "zod/v4";
import type { Formy } from "$lib/index.svelte";

// ============================================================================

export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

// ============================================================================

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.id) return {
		type: null
	}

	const type = locals.db.query<EventType, [string]>("SELECT * FROM event_type WHERE id = ?").get(params.id);
	if (!type) error(404, "Event type not found");
	return {
		type: type
	};
};