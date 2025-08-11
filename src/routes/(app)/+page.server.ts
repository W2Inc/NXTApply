import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export type AvailableUserEvent = {
	id: string;
	name: string;
	address: string;
	description: string | null;
	trackId: string | null;
	startsAt: string;
	maxUsers?: number;
	registerUntil: string | null;
	completedAt: string | null;
	requires: string | null;
	userEventId: string | null;
};

export const load: PageServerLoad = async ({ locals }) => {
	const events = db
		.query<AvailableUserEvent, [string]>(
			`
			WITH user_completed_event_types AS (
				SELECT DISTINCT e2.eventTypeId
				FROM user_event ue2
				JOIN event e2 ON ue2.eventId = e2.id
				WHERE ue2.userId = ?1 AND ue2.completedAt IS NOT NULL
			),
			user_event_types AS (
				SELECT DISTINCT e2.eventTypeId
				FROM user_event ue2
				JOIN event e2 ON ue2.eventId = e2.id
				WHERE ue2.userId = ?1
			),
			event_requires AS (
				SELECT ed.eventId, GROUP_CONCAT(rt.name) AS requires
				FROM event_type_dependency ed
				JOIN event_type rt ON ed.requiredTypeId = rt.id
				WHERE ed.requiredTypeId NOT IN (SELECT eventTypeId FROM user_completed_event_types)
				GROUP BY ed.eventId
			)
			SELECT
				e.id,
				et.name AS name,
				et.description AS description,
				e.startsAt,
				e.address,
				e.maxUsers,
				e.trackId,
				e.registerUntil,
				ue.completedAt,
				er.requires,
				ue.id as userEventId
			FROM event e
			JOIN event_type et ON e.eventTypeId = et.id
			LEFT JOIN user_event ue ON e.id = ue.eventId AND ue.userId = ?1
			LEFT JOIN event_requires er ON e.id = er.eventId
			WHERE
				e.startsAt >= datetime('now', '-7 days')
				AND (
					ue.userId = ?1
					OR e.eventTypeId NOT IN (SELECT eventTypeId FROM user_event_types)
				)
			ORDER BY e.startsAt DESC
			`
		)
		.all(locals.session.userId);

	return {
		events
	};
};
