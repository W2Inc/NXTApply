import { error } from '@sveltejs/kit';
import * as github from '$lib/server/providers/github';
import * as google from '$lib/server/providers/google';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	const provider = event.params.provider;
	if (!provider) return error(404);
	switch (provider) {
		case 'github':
			return github.generate(event);
		case 'google':
			return google.generate(event);
		default:
			return error(404);
	}
}
