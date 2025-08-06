// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { form, getRequestEvent, query } from '$app/server';
import { FormKit } from '$lib/form.svelte';
import type { ApplicationEvent } from '@prisma/client';
import { z } from 'zod/v4';

// ============================================================================

type AvailableUserEvent = {
	id: string;
	name: string;
	address: string;
	description: string | null;
	startsAt: Date;
	maxUsers?: number;
	registerUntil: Date | null;
	completedAt: Date | null;
	requires: string | null;
	eventId: string | null;
};

// Queries
// ============================================================================

export const getEventsForUser = query(() => {
	const { locals } = getRequestEvent();
	return locals.db
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
					e.registerUntil,
					ue.completedAt,
					er.requires,
					ue.id as eventId
			FROM event e
			JOIN event_type et ON e.eventTypeId = et.id
			LEFT JOIN user_event ue ON e.id = ue.eventId AND ue.userId = ?1
			LEFT JOIN event_requires er ON e.id = er.eventId
			WHERE
					ue.userId = ?1
					OR e.eventTypeId NOT IN (SELECT eventTypeId FROM user_event_types)
			ORDER BY e.startsAt
			`
		)
		.all(locals.session.userId);
});

// Forms
// ============================================================================

const registerSchema = z.object({
	eventID: z.base64url()
});

export const registerEvent = form(async (data) => {
	const { locals } = getRequestEvent();
	const form = await FormKit.parse(data, registerSchema, locals.locale);
	if (form.error) {
		return FormKit.fail(400, FormKit.Issues.InvalidValues)
	}

	const event = locals.db
		.query<ApplicationEvent, [string]>(`SELECT * FROM event WHERE id = ?`)
		.get(form.data.eventID) ?? FormKit.fail(400)

	return FormKit.success();
});
