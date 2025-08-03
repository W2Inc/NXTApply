// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { ApplicationEvent, EventType, EventTypeDependency, UserEvent } from "@prisma/client";
import type { PageServerLoad, Actions } from "./$types";
import { paginate } from "$lib/server/paginate.svelte";
import z from "zod/v4";
import { Formy } from "$lib/index.svelte";

// ============================================================================

export type EventTypeResult = {
	usageCount: number;
} & EventType;

export const load: PageServerLoad = ({ locals, url }) => {
	const page = url.searchParams.get('page') ?? '1';

	return {
		eventTypes: paginate<EventTypeResult>(`
			SELECT
				et.*,
				COUNT(e.id) AS usageCount
			FROM event_type et
			LEFT JOIN event e ON e.eventTypeId = et.id
			GROUP BY et.id
			ORDER BY et.createdAt DESC
		`, locals, page)
	};
};


const actionSchema = z.object({
	id: z.string()
});

export const actions: Actions = {
	remove: async ({ request, locals }) => {
		const result = await Formy.parse(request, actionSchema, locals.locale);
		if (result.error) {
			return Formy.fail(400, result);
		}

		const eventId = result.data.id;

		// Delete UserEvent dependencies
		locals.db.transaction(() => {
			locals.db.query<UserEvent, [string]>("DELETE FROM user_event WHERE event_id = ?").run(eventId);
			locals.db.query<EventTypeDependency, [string]>("DELETE FROM event_type_dependency WHERE event_id = ?").run(eventId);
			locals.db.query<ApplicationEvent, [string]>("DELETE FROM event WHERE id = ?").run(eventId);
		});

		return Formy.success("Event and all dependencies deleted successfully.");
	},
};
