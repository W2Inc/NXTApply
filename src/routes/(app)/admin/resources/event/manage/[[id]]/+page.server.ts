import { getTrack } from '@/remotes/track/get.remote';
import type { PageServerLoad } from './$types';
import { getEvent } from '@/remotes/event/get.remote';

export const load: PageServerLoad = async ({ params }) => {
	return {
		event: params.id ? await getEvent(params.id) : null
	};
};
