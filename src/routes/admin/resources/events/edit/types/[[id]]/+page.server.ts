// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error } from '@sveltejs/kit';
import type { EventType } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import z from 'zod/v4';
import { Formy } from '$lib/index.svelte';

// ============================================================================

export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	name: z.string({ error: "Name is required"}).min(1),
	description: z.string().max(1024).optional()
});

// ============================================================================

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.id)
		return {
			type: null
		};

	const type = locals.db
		.query<EventType, [string]>('SELECT * FROM event_type WHERE id = ?')
		.get(params.id);
	if (!type) error(404, 'Event type not found');
	return {
		type: type
	};
};

// ============================================================================

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		const result = await Formy.parse(request, schema, locals.locale);
		console.log(result)
		if (result.error) {
			return Formy.fail(400, result);
		}

		return Formy.success("Success");
	}
};
