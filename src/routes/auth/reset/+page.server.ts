import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ResetToken } from '@prisma/client';
import { sqlite } from '@/server/db';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (token) {
		const [ reset ] = await sqlite`SELECT * FROM reset_token WHERE id = ${token}`;
		if (!reset)
			error(400)
	}

	return {
		token
	}


	// const reset = db.query<ResetToken, [string]>('SELECT * FROM reset_token WHERE id = ?').get(token);
	// if (!reset) error(400);

	// return { token };
};
