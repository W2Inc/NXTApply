// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect } from '@sveltejs/kit';
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
		if (result.error) {
			return Formy.fail(400, result);
		}

		const { name, description } = result.data;

		if (params.id) {
			// Update existing event type
			locals.db.query<EventType, [string, string | null, string]>(
				`UPDATE event_type SET name = ?, description = ? WHERE id = ?`
			).run(name, description ?? null, params.id);

			return Formy.success("Updated successfully.");
		} else {
			// Insert new event type
			const id = Bun.randomUUIDv7('base64url');
			locals.db.query<EventType, [string, string, string | null]>(
				`INSERT INTO event_type (id, name, description) VALUES (?, ?, ?)`
			).run(id, name, description ?? null);

			redirect(303, `/admin/resources/events/types/edit/${id}`);
		}
	}
};
