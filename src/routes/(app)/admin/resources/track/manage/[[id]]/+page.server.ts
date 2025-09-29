import { getTrack } from '@/remotes/track/get.remote';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		track: params.id ? await getTrack(params.id) : null
	};
};
