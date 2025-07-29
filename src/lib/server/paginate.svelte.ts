import { browser } from "$app/environment";

const DEFAULT_PAGE_SIZE = 10;

export interface PaginatedResult<T> {
	items: T[];
	page: number;
	next: boolean;
}

type QueryOptions = {
	table: string;
	orderBy?: string;
	pageParam?: string; // e.g. 'page', 'events_page', etc.
	pageSize?: number;
};

/**
 *
 * @param locals
 * @param url
 * @param options
 * @returns
 */
export function paginate<T>(
	locals: App.Locals,
	url: URL,
	options: QueryOptions
): PaginatedResult<T> {
	const {
		table,
		orderBy = 'createdAt',
		pageParam = 'page',
		pageSize = DEFAULT_PAGE_SIZE
	} = options;

	const rawPage = Number(url.searchParams.get(pageParam));
	const page = !Number.isNaN(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
	const offset = (page - 1) * pageSize;

	// Fetch one extra to detect "has next"
	const rows = locals.db
		.query<T, [number, number]>(
			`SELECT * FROM ${table} ORDER BY ${orderBy} DESC LIMIT ? OFFSET ?`
		)
		.all(pageSize + 1, offset);

	const next = rows.length > pageSize;
	const items = next ? rows.slice(0, pageSize) : rows;

	return {
		items,
		page,
		next
	};
}