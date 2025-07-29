import type { ApplicationEvent, ApplicationTrack } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import z from 'zod/v4';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		events: locals.db.query<ApplicationEvent, []>('SELECT * FROM event').all()
	};
};

const actionSchema = z.object({
	id: z.string()
});

export const actions: Actions = {
	add: async ({ locals }) => {
	},
	remove: async ({ locals }) => {},
};
