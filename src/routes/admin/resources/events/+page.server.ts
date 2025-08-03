import type { ApplicationEvent, EventTypeDependency, UserEvent } from "@prisma/client";
import type { PageServerLoad, Actions } from "./$types";
import { paginate, type PaginatedResult } from "$lib/server/paginate.svelte";
import z from "zod/v4";
import { Formy } from "$lib/index.svelte";


// ============================================================================

export type EventResult = {
	typeName: string;
	userCount: number;
} & ApplicationEvent;

export const load: PageServerLoad = ({ locals, url, params }) => {
	const page = url.searchParams.get('page') ?? '1';

	return {
		events: paginate<EventResult>(`
			SELECT
			e.*,
			et.name AS typeName,
			(
				SELECT COUNT(*)
				FROM user_event ue
				WHERE ue.eventId = e.id
			) AS userCount
			FROM event e
			JOIN event_type et ON e.eventTypeId = et.id
			ORDER BY e.startsAt
		`, locals, page)
	}
};

// ============================================================================

export type FormOutput = Formy.Output<typeof actionSchema>;
const actionSchema = z.object({
	id: z.string()
});


export const actions: Actions = {
	remove: async ({ request, locals }) => {
		const result = await Formy.parse(request, actionSchema, locals.locale);
		if (result.error) {
			return Formy.fail(400, result);
		}

		const deleteAll = locals.db.transaction((eventId: string) => {
			locals.db.query<UserEvent, [string]>("DELETE FROM user_event WHERE eventId = ?").run(eventId);
			locals.db.query<EventTypeDependency, [string]>("DELETE FROM event_type_dependency WHERE eventId = ?").run(eventId);
			locals.db.query<ApplicationEvent, [string]>("DELETE FROM event WHERE id = ?").run(eventId);
		});

		deleteAll(result.data.id);
		return Formy.success("Event and all dependencies deleted successfully.");
	},
};
