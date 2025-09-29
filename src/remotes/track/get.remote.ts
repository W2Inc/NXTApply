// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from "zod";
import { query } from "$app/server";
import type { ISO } from "$lib/utils";
import { sqlite } from "@/server/db";
import type { ApplicationStep, ApplicationTrack } from "@prisma/client";
import { error } from "@sveltejs/kit";
import type { CombinedTrack } from "$lib/components/track/state.svelte";
import Logger from "$lib/logger";

// ============================================================================

export const getTrack = query(z.string(), async (id) => {
	const [ track ] = await sqlite<ISO<ApplicationTrack>[]>`
		SELECT * FROM application_track
		WHERE id = ${id}
	`;

	if (!track) {
		return error(404);
	}

	const steps = await sqlite<ISO<ApplicationStep>[]>`
		SELECT * FROM application_step
		WHERE trackId = ${track.id}
		ORDER BY "order"
	`;

	return {
		...track,
		steps
	} satisfies CombinedTrack;
})
