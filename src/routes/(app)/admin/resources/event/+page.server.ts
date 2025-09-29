import { Pagination } from '@/server/db';
import type { PageServerLoad } from './$types';
import type { User } from '@prisma/client';

export const load: PageServerLoad = ({ locals, url, params }) => {
	const page = url.searchParams.get('page') ?? undefined;
	const size = url.searchParams.get('size') ?? '1';

	return {
		events: Pagination.query<User[]>(`SELECT * FROM event ORDER BY createdAt DESC`, {
			page,
			size
		})
	};
};
