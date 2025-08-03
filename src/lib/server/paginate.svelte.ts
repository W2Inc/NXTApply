// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { SQLQueryBindings } from "bun:sqlite";

export const PageSize = 10;

// ============================================================================

export interface PaginatedResult<T> {
	items: T[];
	page: number;
	next: boolean;
}

// ============================================================================

/**
 * Executes a paginated SQL query and returns the results along with pagination metadata.
 *
 * @template T - The type of the items returned by the query.
 * @param sql - The SQL query string to execute. Should not include LIMIT or OFFSET clauses.
 * @param locals - The application locals containing the database connection.
 * @param [pagination] - Optional pagination parameters.
 * @param [pagination.page=1] - The current page number (1-based).
 * @param [pagination.pageSize=PageSize] - The number of items per page.
 * @param [params=[]] - Optional array of SQL query bindings to be used in the query.
 * @returns An object containing the paginated items, the current page, and a boolean indicating if there is a next page.
 */
export function paginate<T>(
	sql: string,
	locals: App.Locals,
	page: number | string = 1,
	...inputs: SQLQueryBindings[]
): PaginatedResult<T> {

	// Sanitize the garbage into something usable.
	let sPage = Number(page);
	sPage = !Number.isNaN(sPage) && sPage > 0 ? Math.floor(sPage) : 1;
	if (sPage > Number.MAX_SAFE_INTEGER) {
		sPage = Number.MAX_SAFE_INTEGER;
	}

	const offset = (sPage - 1) * PageSize;
	const items = locals.db
		.query<T, SQLQueryBindings[]>(`${sql} LIMIT ? OFFSET ?`)
		.all(...inputs, PageSize + 1, offset);

	const next = items.length > PageSize;
	const paginated = next ? items.slice(0, PageSize) : items;

	return {
		items: paginated,
		page: sPage,
		next
	};
}