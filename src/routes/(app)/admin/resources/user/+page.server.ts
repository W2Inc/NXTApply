import { Pagination } from '@/server/db';
import type { PageServerLoad } from './$types';
import type { User } from '@prisma/client';
import { UserFlag } from '$lib';

export const load: PageServerLoad = ({ locals, url, params }) => {
	const page = url.searchParams.get('page') ?? undefined;
	const size = url.searchParams.get('size') ?? "1";

	return {
		users: Pagination.query<User[]>(
			`
			SELECT * FROM user WHERE flags & ${UserFlag.IsAdmin} != 0
			ORDER BY createdAt DESC
		`,
			{ page, size }
		)
	};
};
