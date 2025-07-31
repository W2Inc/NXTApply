import type { ApplicationTrack } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import z from 'zod/v4';
import { Formy } from '$lib/index.svelte';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		tracks: locals.db.query<ApplicationTrack, []>('SELECT * FROM application_track').all()
	};
};

const actionSchema = z.object({
	id: z.string()
});

export const actions: Actions = {
	add: async ({ locals }) => {
		locals.db.query('INSERT INTO ');
	},
	remove: async ({ locals }) => {},
	activate: async ({ locals, request }) => {

		await new Promise((resolve) => setTimeout(resolve, 5000));
		const form = await request.formData();
		const result = await actionSchema.safeParseAsync(Object.fromEntries(form.entries()));
		if (result.error) {
			return Formy.fail(400, result);
		}

		locals.db.run<[string]>(
			'UPDATE application_track SET isActive = CASE WHEN id = ? THEN 1 ELSE 0 END',
			[result.data.id]
		);

		return Formy.success("Activated!")
	}
};
