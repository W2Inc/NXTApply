import { dbQuery } from '$lib/query.svelte';
import type { ApplicationEvent, ApplicationTrack } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals, url }) => {
	return {
		tracks: locals.db.query('SELECT * FROM application_track').all()
	};
};

export const actions: Actions = {
	add: async ({ locals }) => {
		locals.db.query("INSERT INTO ")
	},
	remove: async ({ locals }) => {}
};
