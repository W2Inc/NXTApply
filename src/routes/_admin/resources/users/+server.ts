// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { z } from 'zod/v4';
import type { User } from '@prisma/client';
import type { RequestHandler } from './$types';

// ============================================================================

// const schema = z.object({
// 	page: z.number().positive().default(1),
// 	size: z.number().positive().default(25)
// });

// ============================================================================

export const GET: RequestHandler = async ({ locals, url }) => {
	// return new Response(null, { status: 404 });

	// const params = await schema.safeParseAsync({
	// 	page: url.searchParams.get('page') ?? undefined,
	// 	size: url.searchParams.get('size') ?? undefined
	// });

	// if (params.error) {
	// 	return new Response(null, { status: 400 });
	// }

	// const users = locals.db
	// 	.query<User, [number, number]>('SELECT * FROM user ORDER BY createdAt DESC LIMIT ? OFFSET ?')
	// 	.all(params.data.page, (params.data.page - 1) * params.data.size);

	const users = locals.db.query<User, []>('SELECT * FROM user ORDER BY createdAt DESC').all();

	async function* generate() {
		yield 'id,name,email,createdAt\n';
		for (const user of users) {
			yield `${user.id},${user.firstName ?? 'N/A'} ${user.lastName ?? ''},${user.email},${user.createdAt}\n`;
		}
	}

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async pull(controller) {
			const iterator = generate();
			for await (const chunk of iterator) controller.enqueue(encoder.encode(chunk));
			controller.close();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment'
		}
	});
};
