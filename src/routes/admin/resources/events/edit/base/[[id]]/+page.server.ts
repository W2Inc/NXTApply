// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect } from "@sveltejs/kit";
import type { ApplicationEvent, EventType } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import z from "zod/v4";
import { Formy } from "$lib/index.svelte";
import { fromDate } from "@internationalized/date";

export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	eventTypeId: z.string().min(1, "Event type is required"),
	dependencies: z.string().optional(),
	startsAt: z.coerce.date(),
	registerUntil: z.preprocess(
		(val) => (val === "" ? undefined : val),
		z.coerce.date().optional()
	)
});

// ============================================================================

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventTypes = locals.db
		.query<EventType, []>("SELECT * FROM event_type ORDER BY name ASC")
		.all();

	if (!params.id) {
		return {
			event: null,
			eventTypes
		};
	}

	const event = locals.db
		.query<ApplicationEvent, [string]>("SELECT * FROM event WHERE id = ?")
		.get(params.id);

	if (!event) error(404, "Event not found");

	const dependencies = locals.db
		.query<{ requiredTypeId: string }, [string]>(
			"SELECT requiredTypeId FROM event_type_dependency WHERE eventId = ?"
		)
		.all(params.id);

	return {
		event: { ...event, dependencies },
		eventTypes
	};
};

// ============================================================================

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const result = await Formy.parse(request, schema, locals.locale);
		if (result.error) {
			return Formy.fail(400, result);
		}

		console.log(result.data)

		const { eventTypeId, dependencies, startsAt, registerUntil } = result.data;

		// Check that registerUntil is after startsAt (if present)
		if (registerUntil) {
			const start = fromDate(startsAt, locals.tz);
			const end = fromDate(registerUntil, locals.tz);
			if (start.compare(end) >= 0) {
				return Formy.fail(400, "Registration cutoff must be after the event start.");
			}
		}

		const db = locals.db;
		let eventId = params.id ?? Bun.randomUUIDv7('base64url');
		db.transaction(() => {
			// Insert or update the event
			if (!params.id) {
				// CREATE
				db.prepare(`
					INSERT INTO event (id, eventTypeId, startsAt, registerUntil, createdAt, updatedAt)
					VALUES ($id, $eventTypeId, $startsAt, $registerUntil, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
				`).run({
					id: eventId,
					eventTypeId,
					startsAt: startsAt.toISOString(),
					registerUntil: registerUntil ? registerUntil.toISOString() : null
				});
			} else {
				// UPDATE
				db.prepare(`
					UPDATE event
					SET eventTypeId = $eventTypeId,
						startsAt = $startsAt,
						registerUntil = $registerUntil,
						updatedAt = CURRENT_TIMESTAMP
					WHERE id = $id
				`).run({
					id: eventId,
					eventTypeId,
					startsAt: startsAt.toISOString(),
					registerUntil: registerUntil ? registerUntil.toISOString() : null
				});

				// Remove existing dependencies (for update)
				db.prepare(`DELETE FROM event_type_dependency WHERE eventId = $id`).run({ id: eventId });
			}

			// Insert dependencies
			if (dependencies && Array.isArray(dependencies)) {
				const insertDep = db.prepare(`
					INSERT INTO event_type_dependency (eventId, requiredTypeId)
					VALUES ($eventId, $requiredTypeId)
				`);

				for (const requiredTypeId of dependencies) {
					insertDep.run({
						eventId,
						requiredTypeId
					});
				}
			}
		})();

		redirect(303, `/admin/resources/events/edit/base/${eventId}`);
	}
};
