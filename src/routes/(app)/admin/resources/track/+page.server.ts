import { Pagination } from '@/server/db';
import type { PageServerLoad } from './$types';
import type { User } from '@prisma/client';

export const load: PageServerLoad = ({ locals, url, params }) => {
	const page = url.searchParams.get('page') ?? undefined;
	const size = url.searchParams.get('size') ?? '1';

	return {
		tracks: Pagination.query<User[]>(`SELECT * FROM application_track ORDER BY createdAt DESC`, {
			page,
			size
		})
	};
};
