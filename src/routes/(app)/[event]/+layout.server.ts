// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { ApplicationStep, ApplicationUserTrack, UserEvent } from '@prisma/client';

// ============================================================================

export const load: LayoutServerLoad = async ({ locals, params, url }) => {
	const ev = getUserEvent(locals, locals.session.userId, params.event);
	if (!ev || ev.completedAt) {
		console.log(params, ev)
		redirect(303, '/');
	}

	// We need to complete steps on a track!
	if (ev.trackId) {
		const ut = ensureTrack(locals, locals.session.userId, ev.trackId);
		if (ut.completedAt) {
			completeEvent(locals, ev.id);
			redirect(303, '/');
		}

		const steps = getSteps(locals, ut.id, ev.trackId);
		const currentStep = steps.find((step) => step.completedAt === null);
		if (currentStep) {
			const to = `/${ev.eventId}/${currentStep.id}`
			if (url.pathname !== to)
				redirect(303, to);

			// We are now definitely at the /[event]/[step] page
			return { steps, step: currentStep };
		}

		// They all are completed, congrats!
		locals.db.transaction(() => {
			completeUserTrack(locals, ut.id);
			completeEvent(locals, ev.id);
		})();

		redirect(303, '/');
	}
};

// ============================================================================

function completeEvent(locals: App.Locals, userEventId: string) {
	locals.db.run(
		'UPDATE user_event SET completedAt = COALESCE(completedAt, unixepoch()) WHERE id = ?',
		[userEventId]
	);
}

function completeUserTrack(locals: App.Locals, userTrackId: string) {
	locals.db.run(
		'UPDATE application_user_track SET completedAt = COALESCE(completedAt, unixepoch()) WHERE id = ?',
		[userTrackId]
	);
}

/** Get the user event. */
function getUserEvent(locals: App.Locals, userId: string, event: string) {
	return locals.db
		.query<UserEvent & { trackId: string | null }, [string, string]>(
			`
				SELECT uv.*, e.trackId FROM user_event uv
				LEFT JOIN event e ON e.id = uv.eventId
				WHERE userId = ? AND eventId = ?
			`
		)
		.get(userId, event);
}

function ensureTrack(locals: App.Locals, userId: string, trackId: string) {
	let userTrack = locals.db
		.query<ApplicationUserTrack, [string, string]>(
			`
				SELECT *
				FROM application_user_track
				WHERE userId = ? AND trackId = ?
			`
		)
		.get(userId, trackId);

	if (!userTrack) {
		userTrack = locals.db
			.query<ApplicationUserTrack, [string, string, string]>(
				`
				INSERT INTO application_user_track (id, userId, trackId)
				VALUES (?, ?, ?)
				RETURNING *
				`
			)
			.get(Bun.randomUUIDv7('base64url'), userId, trackId);
	}

	return userTrack!;
}

function getSteps(locals: App.Locals, userTrackId: string, trackId: string) {
	type StepWithStatus = ApplicationStep & { completedAt: string | null };
	return locals.db
		.query<StepWithStatus, [string, string]>(
			`
				SELECT s.*, us.completedAt
				FROM application_step s
				LEFT JOIN application_user_step us
						ON us.stepId = s.id AND us.userTrackId = ?
				WHERE s.trackId = ?
				ORDER BY s."order"
			`
		)
		.all(userTrackId, trackId);
}
