// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod';
import { FormKit } from '$lib/form.svelte';
import { sqlite } from '@/server/db';
import type { ApplicationEvent } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { sql } from 'bun';
import { userCount } from './count.remote';

// ============================================================================

const schema = z.object({
	id: z.string(),
	action: z.enum(['join', 'leave'])
});

export const eventAction = form(schema, async ({ id, action }) => {
	const [event] = await sqlite<ApplicationEvent[]>`
		SELECT * FROM event WHERE id = ${id}
	`;

	if (!event) error(404);

	const { locals } = getRequestEvent();
	const userId = locals.session.userId;
	const [userEvent] = await sqlite<ApplicationEvent[]>`
		SELECT * FROM user_event WHERE eventId = ${event.id} AND userId = ${userId}
	`;

	if (action === 'join') {
		if (userEvent && event.trackId) redirect(303, `/${event.id}`);
		else if (userEvent) return error(400, 'You are already registered for this event.');

		const uuid = Bun.randomUUIDv7('base64url');
		await sqlite`INSERT INTO user_event ${sql({
			id: uuid,
			userId,
			eventId: event.id
		})}`;
	} else if (action === 'leave') {
		if (!userEvent) return error(400, 'You are not registered for this event.');

		await sqlite`DELETE FROM user_event WHERE eventId = ${event.id} AND userId = ${userId}`;
	}

	if (event.trackId && action === 'join')
		redirect(303, `/${event.id}`);
	return FormKit.Reply.NoContent();
});

