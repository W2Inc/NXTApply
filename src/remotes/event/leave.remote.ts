// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod';
import { FormKit } from '$lib/form.svelte';
import { sqlite } from '@/server/db';
import type { ApplicationEvent } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { form, getRequestEvent } from '$app/server';
import { userCount } from './count.remote';

// ============================================================================

const schema = z.object({
	id: z.string()
});

// ============================================================================

export const leave = form(schema, async ({ id }) => {
	const [event] = await sqlite<ApplicationEvent[]>`
		SELECT * FROM event WHERE id = ${id}
	`;

	if (!event) error(404);

	const { locals } = getRequestEvent();
	const userId = locals.session.userId;
	const [userEvent] = await sqlite<ApplicationEvent[]>`
		SELECT * FROM user_event WHERE eventId = ${event.id} AND userId = ${userId}
	`;

	if (!userEvent)
		error(400, 'You are not registered for this event.');

	await sqlite`DELETE FROM user_event WHERE id = ${userEvent.id}`;
	await userCount(event.id).refresh();
	return FormKit.Reply.NoContent();
});
