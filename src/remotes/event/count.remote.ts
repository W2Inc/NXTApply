// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod';
import { sql } from 'bun';
import { query } from '$app/server';
import { sqlite, TTLCache } from '@/server/db';

// ============================================================================

export const getEventUserCount = query.batch(z.string(), async (ids) => {
	type EventCounts = Array<{ eventId: string; count: number }>;
	const rows = await sqlite<EventCounts>`
		SELECT eventId, COUNT(*) as count FROM user_event
		WHERE eventId IN ${sql(ids)}
		GROUP BY eventId
	`;

	const lookup = new Map(rows.map((row) => [row.eventId, row.count]));
	return (id: string) => lookup.get(id) ?? 0;
});
