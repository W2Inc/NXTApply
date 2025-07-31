import type { ApplicationEvent, EventType } from "@prisma/client";
import type { PageServerLoad, Actions } from "./$types";
import { paginate, type PaginatedResult } from "$lib/server/paginate.svelte";
import z from "zod/v4";
import { Formy, PageSize } from "$lib/index.svelte";
import { error } from "@sveltejs/kit";

// ============================================================================

function getEvent(locals: App.Locals, eventID: string) {
	return locals.db
		.query<ApplicationEvent, [string]>(`
			SELECT *
			FROM event
			WHERE event.id = ?
		`)
		.get(eventID);
}

function getEventTypes(locals: App.Locals) {
	return locals.db
		.query<EventType, []>(`
			SELECT *
			FROM event_type
			ORDER BY name ASC
		`)
		.all();
}

function getDependencies(locals: App.Locals, eventID: string) {
	return locals.db
		.query<string, [string]>(`
			SELECT requiredTypeId
			FROM event_type_dependency
			WHERE eventId = ?
		`)
		.all(eventID);
}

// ============================================================================

export const load: PageServerLoad = ({ locals, url, params }) => {
	return {
		types : getEventTypes(locals),
		event: params.id ? getEvent(locals, params.id) ?? error(404) : null,
		dependencies: params.id ? getDependencies(locals, params.id) : [],
	}
};

// ============================================================================

// export type EditableEvent = z.infer<typeof schema>;
export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	maxUsers: z.coerce.number().min(1, "Must be at least 1"),
	eventTypeId: z.string().min(1, "Event type is required"),
	dependencies: z.string().optional(),
	startsAt: z.coerce.date(),
	registerUntil: z.preprocess(
		(val) => (val === "" ? undefined : val),
		z.coerce.date().optional()
	)
});


export const actions: Actions = {
	// UPSERT
	default: async ({ request, locals }) => {
		// const result = await Formy.parse(request, actionSchema, locals.locale);
		// if (result.error) {
		// 	return Formy.fail(400, result);
		// }

		// locals.db
		// 	.query<ApplicationEvent, [string]>("DELETE FROM event WHERE id = ?")
		// 	.run(result.data.id);

		return Formy.success("Event deleted successfully.");
	},
};
