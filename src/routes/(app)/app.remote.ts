// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import * as v from 'valibot';
import { form, getRequestEvent } from '$app/server';
import { FormKit } from '$lib/form.svelte';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { ApplicationEvent } from '@prisma/client';

// ============================================================================

type EventJoinOutput = FormKit.FormResult<typeof eventJoinSchema>;
const eventJoinSchema = v.object({
	eventID: v.pipe(v.string())
});

// ============================================================================

const qJoinEvent = db.prepare('INSERT INTO user_event (id, userId, eventId) VALUES (?, ?, ?)');
const qEvent = db.prepare<ApplicationEvent, [string]>('SELECT * FROM event WHERE id = ?');
const qUserEvent = db.prepare<ApplicationEvent, [string, string]>(
	'SELECT * FROM user_event WHERE eventId = ? AND userId = ?'
);

// ============================================================================

export const joinEvent = form<EventJoinOutput>(async (data) => {
	const form = await FormKit.parse(data, eventJoinSchema);
	if (!form.success) return FormKit.invalid(form);

	const event = qEvent.get(form.output.eventID) ?? error(404);

	// Is user already subcribed ?
	const { locals } = getRequestEvent();
	const userEvent = qUserEvent.get(form.output.eventID, locals.session.userId);
	if (userEvent && event.trackId)
		redirect(303, `/${event.id}`);

	qJoinEvent.run(Bun.randomUUIDv7('base64url'), locals.session.userId, event.id);
	if (event.trackId) redirect(303, `/${event.id}`);
	redirect(303, '/')
});
