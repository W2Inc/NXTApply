// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod/v4';
import type { ApplicationEvent, User, UserEvent } from '@prisma/client';
import { query, getRequestEvent, form } from '$app/server';
import { Pagination } from '$lib/server/paginate.svelte';
import { Formy } from '$lib/index.svelte';
import { error, redirect } from '@sveltejs/kit';
import { FormKit } from '$lib/form.svelte';

// ============================================================================

const schema = z.object({
	eventID: z.base64url(),
	kek: z.string()
});

// ============================================================================

export const joinEvent = form(async (data) => {
	const { locals } = getRequestEvent();
	const result = await FormKit.parse(data, schema, locals.locale);
	if (result.error) {
		error(400, "NEIJ")
	}
	return { kanker: true }
});



/*
	const { locals } = getRequestEvent();
	const result = await Formy.parse(data, schema, locals.locale);

	if (result.error) error(400);

	const event = locals.db
		.query<ApplicationEvent, [string]>(`SELECT * FROM event WHERE id = ?`)
		.get(result.data.eventID) ?? error(404);

	// Check if the user is already subscribed to the event
	const existing = locals.db
		.query<{ existing: number; count: number }, [string, string]>(
			`SELECT
				COUNT(CASE WHEN userId = ?1 AND eventId = ?2 THEN 1 END) as existing,
				COUNT(*) as count
			FROM user_event
			WHERE eventId = ?2`
		)
		.get(locals.session.userId, event.id)!;

	if (!!event.maxUsers && existing.count >= event.maxUsers) {
		error(403, 'Event is full');
	}

	if (!existing) {
		locals.db.run(`INSERT INTO user_event (id, userId, eventId) VALUES (?, ?, ?)`, [
			Bun.randomUUIDv7('base64url'),
			locals.session.userId,
			result.data.eventID
		]);
	}

	return redirect(303, `/${result.data.eventID}`);
	*/
