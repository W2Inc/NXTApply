// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ApplicationStep, ApplicationTrack } from '@prisma/client';
import { Formy } from '$lib/index.svelte';

// ============================================================================

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.id) return { track: null };

	const track = locals.db
		.query<ApplicationTrack, [string]>('SELECT * FROM application_track WHERE id = ?')
		.get(params.id);

	if (!track) error(404);

	const steps = locals.db
		.query<
			ApplicationStep,
			[string]
		>('SELECT * FROM application_step WHERE trackId = ? ORDER BY "order"')
		.all(params.id);

	return {
		track: {
			data: track,
			steps
		}
	};
};

// ============================================================================

export const actions: Actions = {
	create: async ({ locals }) => {
		return Formy.success("Yay!");
	},
	update: async ({ locals }) => {
		return Formy.success("Yay!");
	},
	delete: async ({ locals }) => {
		return Formy.success("Yay!");
	}
};
