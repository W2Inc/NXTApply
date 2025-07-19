import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
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
