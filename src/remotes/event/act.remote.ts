// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================
// ACT: JOIN
// 1. User needs to be verified
// 2. Event must not be expired
// 3. Event must not be full
// 4. User must not already be subscribed
// ============================================================================
// ACT: LEAVE
// 1. User needs to be verified
// 2. Event must not have already started
// 3. User must be subscribed
// ============================================================================

import z from 'zod';
import { form, getRequestEvent } from '$app/server';
import { sqlite } from '@/server/db';
import { UTC, type ISO } from '$lib/utils';
import type { ApplicationEvent, UserEvent } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { Auth } from '@/server/auth';
import { getEventUserCount } from './count.remote';
import { sql } from 'bun';
import { FormKit } from '$lib/form.svelte';

// ============================================================================

const schema = z.object({
	id: z.string(),
	action: z.enum(['join', 'leave'])
});

// ============================================================================

interface EventAction {
	userId: string;
	event: ISO<ApplicationEvent>;
	userEvent?: ISO<UserEvent>;
	locals: App.Locals;
}

/**
 * Handles the logic for a user joining an event.
 *
 * This function performs several checks before allowing a user to join:
 * - Verifies if the registration period is still open.
 * - Checks if the event has reached its maximum participant limit.
 * - Ensures the user is not already registered for another event of the same type.
 *
 * If all checks pass, the user is registered for the event.
 * If the event has a track, redirects to the event page.
 * Otherwise, returns a no-content reply.
 *
 * @param {EventAction} params - The parameters for joining an event.
 */
async function join({ userId, event, userEvent, locals }: EventAction) {
	// Can they still join?
	const limit = UTC.read(event.registerUntil, locals.tz);
	if (limit && UTC.now(locals.tz).compare(limit) > 0) {
		error(422, 'Event registrations are closed');
	}

	// Is the event full?
	const count = await getEventUserCount(event.id);
	if (event.maxUsers && count + 1 > event.maxUsers) {
		error(422, 'Unable to join, event is full');
	}

	// Check if user is already part of an event such as this one.
	const [exisiting] = await sqlite<{ eventId: string }[]>`
		SELECT ue.eventId
		FROM user_event ue
		JOIN event e ON ue.eventId = e.id
		WHERE ue.userId = ${userId}
		AND e.eventTypeId = ${event.eventTypeId}
	`;

	if (exisiting) {
		error(409, 'Already registered for event');
	}

	// Join the event
	const uuid = Bun.randomUUIDv7('base64url');
	await sqlite`INSERT INTO user_event ${sql({
		id: uuid,
		userId,
		eventId: event.id
	})}`;

	if (event.trackId) redirect(303, `/${event.id}`);
	return FormKit.Reply.NoContent();
}

/**
 * Handles the exit action for a user from an event.
 *
 * Removes the user's registration from the specified event if they are registered and the event is not completed.
 * Throws an error if the user is not registered or if the event has already been completed.
 *
 * @param {EventAction} params - The parameters for the exit action.
 */
async function exit({ userId, event, userEvent, locals }: EventAction) {
	if (!userEvent) error(422, 'You are not registered for this event');
	if (userEvent.completedAt) error(422, "You can't leave a completed event");

	await sqlite`DELETE FROM user_event WHERE eventId = ${event.id} AND userId = ${userId}`;
	return FormKit.Reply.NoContent();
}

// ============================================================================

export const eventAction = form(schema, async ({ id, action }) => {
	const user = await Auth.user();
	if (!user.verified) error(401, 'You need to be verified');

	const [event] = await sqlite<ISO<ApplicationEvent>[]>`
		SELECT * FROM event WHERE id = ${id}
	`;

	if (!event) error(404);
	const { locals } = getRequestEvent();
	const userId = locals.session.userId;
	const [userEvent] = await sqlite<ISO<UserEvent>[]>`
		SELECT * FROM user_event WHERE eventId = ${id} AND userId = ${userId}
	`;

	switch (action) {
		case 'join':
			return await join({ userId, event, userEvent, locals });
		case 'leave':
			return await exit({ userId, event, userEvent, locals });
		default:
			error(501, `Action: ${action} is not implemented`);
	}
});
