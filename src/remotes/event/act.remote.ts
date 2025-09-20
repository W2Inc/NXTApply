// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod';
import { FormKit } from '$lib/form.svelte';
import { sqlite } from '@/server/db';
import type { ApplicationEvent, UserEvent } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { sql } from 'bun';
import { userCount } from './count.remote';

// ============================================================================

const schema = z.object({
	id: z.string(),
	action: z.enum(['join', 'leave'])
});

// ============================================================================

async function join(userId: string, event: ApplicationEvent, userEvent?: UserEvent) {
	if (userEvent) {
		if (event.trackId) redirect(303, `/${event.id}`);
		error(422, 'You are already registered for this event');
	}

	// Are they subcribed already to the same type of event ?
	const [exisiting] = await sqlite<{ eventId: string }[]>`
		SELECT ue.eventId
		FROM user_event ue
		JOIN event e ON ue.eventId = e.id
		WHERE ue.userId = ${userId}
		AND e.eventTypeId = ${event.eventTypeId}
	`;

	if (exisiting) {
		error(409, 'You are already registered for this type of event');
	}

	const uuid = Bun.randomUUIDv7('base64url');
	await sqlite`INSERT INTO user_event ${sql({
		id: uuid,
		userId,
		eventId: event.id
	})}`;

	// If the user needs to peform something, direct them to the event now.
	if (event.trackId) redirect(303, `/${event.id}`);
	return FormKit.Reply.NoContent();
}

async function leave(userId: string, event: ApplicationEvent, userEvent?: UserEvent) {
	if (!userEvent) error(422, 'You are not registered for this event');
	await sqlite`
		DELETE FROM user_event
		WHERE eventId = ${event.id} AND userId = ${userId}
	`;

	return FormKit.Reply.NoContent();
}

// ============================================================================

export const eventAction = form(schema, async ({ id, action }) => {
	const [event] = await sqlite<ApplicationEvent[]>`
		SELECT * FROM event WHERE id = ${id}
	`;

	if (!event) error(404);

	const { locals } = getRequestEvent();
	const userId = locals.session.userId;
	const [userEvent] = await sqlite<UserEvent[]>`
		SELECT * FROM user_event
		WHERE eventId = ${id} AND userId = ${userId}
	`;

	switch (action) {
		case 'join':
			return await join(userId, event, userEvent);
		case 'leave':
			return await leave(userId, event, userEvent);
		default:
			error(501, `Action: ${action} is not implemented`);
	}
});
