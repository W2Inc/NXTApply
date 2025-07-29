import { paginate } from '$lib/server/paginate.svelte';
import type { ApplicationEvent, EventType } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import z from 'zod/v4';
import { Formy } from '$lib/index.svelte';

export const load: PageServerLoad = ({ locals, url }) => {
  return {
    events: paginate<ApplicationEvent>(locals, url, {
      table: 'event',
      orderBy: 'startsAt',
      pageParam: 'p1',
    }),
    types: paginate<EventType>(locals, url, {
      table: 'event_type',
      pageParam: 'p2',
    })
  };
};

const actionSchema = z.object({
	id: z.string()
});

export const actions: Actions = {
	remove: async ({ request, locals }) => {
		const result = await Formy.parse(request, actionSchema);
		if (result.error) {
			return Formy.fail(400, result);
		}

		locals.db
			.query<ApplicationEvent, [string]>("DELETE FROM event WHERE id = ?")
			.run(result.data.id);

		return Formy.success("Event deleted successfully.");
	},
};