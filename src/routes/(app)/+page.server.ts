// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { sqlite } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import type { ListedUserEvent } from '$lib/components/event/index.svelte';

// ============================================================================

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.session.userId;
	return {
		events: sqlite<ListedUserEvent[]>`
			WITH user_completed_event_types AS (
				SELECT DISTINCT e2.eventTypeId
				FROM user_event ue2
				JOIN event e2 ON ue2.eventId = e2.id
				WHERE ue2.userId = ${userId} AND ue2.completedAt IS NOT NULL
			),
			user_event_types AS (
				SELECT DISTINCT e2.eventTypeId
				FROM user_event ue2
				JOIN event e2 ON ue2.eventId = e2.id
				WHERE ue2.userId = ${userId}
			),
			event_requires AS (
				SELECT ed.eventId, GROUP_CONCAT(rt.name) AS requires
				FROM event_type_dependency ed
				JOIN event_type rt ON ed.requiredTypeId = rt.id
				WHERE ed.requiredTypeId NOT IN (SELECT eventTypeId FROM user_completed_event_types)
				GROUP BY ed.eventId
			)
			SELECT
				e.*,
				et.name AS name,
				et.description AS description,
				ue.completedAt,
				er.requires,
				ue.id as userEventId
			FROM event e
			JOIN event_type et ON e.eventTypeId = et.id
			LEFT JOIN user_event ue ON e.id = ue.eventId AND ue.userId = ${userId}
			LEFT JOIN event_requires er ON e.id = er.eventId
			WHERE
			e.startsAt >= datetime('now', '-7 days')
			AND (
				ue.userId = ${userId}
				OR e.eventTypeId NOT IN (SELECT eventTypeId FROM user_event_types)
			)
			ORDER BY e.startsAt DESC
		`
	};
};
