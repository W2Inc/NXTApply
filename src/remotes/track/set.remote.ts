// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { form } from '$app/server';
import z from 'zod';
import { sqlite } from '@/server/db';
import { sql } from 'bun';
import { FormKit } from '$lib/form.svelte';
import Logger from '$lib/logger';

// ============================================================================

const schema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(256),
	description: z.string().max(2048).optional(),
	steps: z.array(
		z.object({
			content: z
				.string()
				.max(1024 * 1024, { error: 'Max 1MB'}) // 1MB
				.optional(),
			order: z.coerce.number<string>().min(0).max(Number.MAX_SAFE_INTEGER),
			type: z.literal(['BOARDING', 'INTERMISSION', 'CHALLENGE', 'WAITING', 'RESULT']),
			conditional: z
				.string()
				.max(1024 * 1024, { error: 'Max 1MB'}) // 1MB
				.optional()
		})
	)
});

// ============================================================================

/** Create a new track */
async function write(data: z.infer<typeof schema>) {
	const id = Bun.randomUUIDv7('base64url');
	const steps = data.steps.map((v, i) => {
		return {
			id: Bun.randomUUIDv7('base64url'),
			type: v.type,
			content: v.content ?? null,
			order: i,
			trackId: id,
			conditionals: null // TODO: Resolve the JSON
		};
	});

	await sqlite.transaction(async (tx) => {
		await tx`INSERT INTO application_track ${sql({
			id,
			name: data.name,
			description: data.description ?? null,
			isActive: false
		})}`;

		await tx`INSERT INTO application_step ${sql(steps)}`;
	});
}

// ============================================================================

export const set = form(schema, async (data) => {
	Logger.dbg(data, data.id === undefined);
	return FormKit.Reply.NoContent();
	// if (!data.id) return await write(data);

	// // Update record
	// await sqlite.transaction(async (tx) => {
	// 	// Destroy all progress of users doing this track.
	// 	await tx`DELETE FROM application_user_track WHERE trackId = ${data.id}`;
	// 	await tx`DELETE FROM application_step WHERE trackId = ${data.id}`;
	// 	await tx`
	// 		UPDATE application_track
	// 		SET
	// 			name = ${data.name},
	// 			description = COALESCE(${data.description}, description),
	// 			updatedAt = ${UTC.write(UTC.now())}
	// 		WHERE id = ${data.id}
	// 	`;

	// 	const items = data.steps.map((v, i) => {
	// 		return {
	// 			id: Bun.randomUUIDv7('base64url'),
	// 			type: v.type,
	// 			content: v.content ?? null,
	// 			order: i,
	// 			trackId: data.id,
	// 			conditionals: null // Resolve these.
	// 		};
	// 	});

	// 	await tx`INSERT INTO application_step ${sql(items)}`;
	// });

	// redirect(303, `/admin/resources/track/manage/${data.id}`);
});
