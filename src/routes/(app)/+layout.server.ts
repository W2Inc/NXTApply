import { db } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad, RouteParams } from './$types';
import { areNull } from '$lib';

export const load: LayoutServerLoad = async ({ locals, route }) => {
	const session = locals.session ?? error(401);
	const [stage, user] = await Promise.all([
		await db.query.stages.findFirst({
			where: (stages, { eq }) => eq(stages.userId, session.userId),
			orderBy: (stages, { desc }) => desc(stages.createdAt)
		}),
		await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, session.userId)
		})
	]);

	if (!user) {
		error(404);
	}

	if (
		route.id !== '/(app)' && route.id !== '/(app)/[user]/boarding' &&
		areNull(user, ['dob', 'first_name', 'last_name', 'gender', 'phone'])
	)
		redirect(302, `/`);
	// if (
	// 	route.id !== '/(app)/[user]/boarding' &&
	// 	areNull(user, ['dob', 'first_name', 'last_name', 'gender', 'phone'])
	// ) {
	// 	redirect(302, `/`);
	// }

	return {
		stage,
		user
	};
};
