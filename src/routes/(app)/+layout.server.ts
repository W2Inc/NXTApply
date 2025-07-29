// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { ApplicationEvent, EventType } from '@prisma/client';

// ============================================================================

/**
 * This function returns those event's available to the user.
 * It returns the events that the user still needs or has completed
 * @param locals
 * @param userId
 * @returns
 */
function getAvailableEvents(locals: App.Locals, userId: string) {
	type AvailableEvents = ApplicationEvent & {
		completedAt: Date | null;
		requires: string | null;
		name: string;
		description: string | null;
	};

	return locals.db
		.query<AvailableEvents, [string, string]>(
			`
			SELECT
				e.*,
				et.name AS name,
				et.description AS description,
				ue.completedAt,
				(
					SELECT GROUP_CONCAT(rt.name)
					FROM event_type_dependency ed
					JOIN event_type rt ON ed.requiredTypeId = rt.id
					WHERE ed.eventId = e.id
						AND NOT EXISTS (
							SELECT 1
							FROM user_event ue2
							JOIN event e2 ON ue2.eventId = e2.id
							WHERE ue2.userId = ?
								AND e2.eventTypeId = ed.requiredTypeId
								AND ue2.completedAt IS NOT NULL
						)
				) AS requires
			FROM event e
			JOIN event_type et ON e.eventTypeId = et.id
			LEFT JOIN user_event ue ON e.id = ue.eventId AND ue.userId = ?;
			`
		)
		.all(userId, userId);
}

// ============================================================================

export const load: LayoutServerLoad = async ({ locals }) => {
	const userId = locals.session?.userId ?? error(403);
	return {
		tz: locals.tz,
		locale: locals.locale,
		events: getAvailableEvents(locals, userId)
	};
};
