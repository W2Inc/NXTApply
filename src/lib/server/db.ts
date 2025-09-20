// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod';
import { SQL } from 'bun';
import { DATABASE_URL } from '$env/static/private';
import Logger from '$lib/logger';

// ============================================================================

export const sqlite = new SQL({
	adapter: 'sqlite',
	filename: DATABASE_URL,
	strict: true,

	onconnect: (e) => {
		if (e) Logger.err(e);
		else Logger.dbg('[DB]: Connected');
	},

	onclose: (e) => {
		if (e) Logger.err(e);
		else Logger.dbg('[DB]: Disconnected');
	}
});

// ============================================================================

export namespace Pagination {
	export const SIZE = 10;

	export interface PaginatedQueryResult<T> {
		items: T[];
		page: number;
		next: boolean;
	}

	export type Query = z.input<typeof schema>;
	export const schema = z.object({
		size: z
			.string()
			.transform((val) => (typeof val === 'string' ? Number(val) : val))
			.default(10)
			.pipe(z.number().min(1).max(100)),
		page: z
			.string()
			.transform((val) => (typeof val === 'string' ? Number(val) : val))
			.default(1)
			.pipe(z.number().min(1).max(Number.MAX_SAFE_INTEGER))
	});

	export async function query<T>(sql: string, pagination: Query) {
		const result = z.safeParse(schema, pagination);
		const { page, size } = result.data as z.output<typeof schema>;
		const offset = (page - 1) * size;
		const items = await sqlite.unsafe<T[]>(`${sql} LIMIT $1 OFFSET $2`, [size + 1, offset]);
		const next = items.length > size;
		const paginated = next ? items.slice(0, size) : items;

		return {
			items: paginated,
			page,
			next
		};
	}
}

/** Modify the SQL Query to allow for direct first result fetching. */

// declare module "bun" {
// 	namespace SQL {
// 		interface Query<T> {
// 			get(): Promise<T extends Array<infer U> ? U | undefined : T>;
// 		}
// 	}
// }

// Patch the prototype of the Query objects returned by sqlite (sqlite is an instance),
// not sqlite.prototype (which is undefined).
// const _queryProto = Object.getPrototypeOf(sqlite``);
// if (!_queryProto.first) {
// 	Object.defineProperty(_queryProto, "get", {
// 		value: function () {
// 			return this.then((rows: any) => (Array.isArray(rows) ? rows[0] : rows));
// 		},
// 		writable: true,
// 		configurable: true,
// 	});
// }
