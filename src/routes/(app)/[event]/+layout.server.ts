// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type {
	ApplicationEvent,
	ApplicationStep,
	ApplicationUserTrack,
	UserEvent
} from '@prisma/client';
import { db } from '$lib/server/db';

// ============================================================================


export const load: LayoutServerLoad = async ({ locals, params, url }) => {
	console.log("Yeah")
	const ev = getUserEvent(locals.session.userId, params.event);
	if (!ev || ev.completedAt) {
		console.log(params, ev);
		redirect(303, '/');
	}

	// We need to complete steps on a track!
	if (ev.trackId) {
		const ut = ensureTrack(locals.session.userId, ev.trackId);
		if (ut.completedAt) {
			completeEvent(ev.id);
			redirect(303, '/');
		}

		const steps = getSteps(ut.id, ev.trackId);
		const currentStep = steps.find((step) => step.completedAt === null);
		if (currentStep) {
			const to = `/${ev.eventId}/${currentStep.id}`;
			console.log(to)
			if (url.pathname !== to) redirect(303, to);

			// We are now definitely at the /[event]/[step] page
			return {
				steps,
				step: currentStep,
				userEvent: ev,
				event: getEvent(ev.eventId)
			};
		}

		// They all are completed, congrats!
		db.transaction(() => {
			completeUserTrack(ut.id);
			completeEvent(ev.id);
		})();

		redirect(303, '/');
	}
};

// ============================================================================

function completeEvent(userEventId: string) {
	db.run('UPDATE user_event SET completedAt = COALESCE(completedAt, unixepoch()) WHERE id = ?', [
		userEventId
	]);
}

function completeUserTrack(userTrackId: string) {
	db.run(
		'UPDATE application_user_track SET completedAt = COALESCE(completedAt, unixepoch()) WHERE id = ?',
		[userTrackId]
	);
}

/** Get the user event. */
function getUserEvent(userId: string, event: string) {
	return db
		.query<UserEvent & { trackId: string | null }, [string, string]>(
			`
				SELECT uv.*, e.trackId FROM user_event uv
				LEFT JOIN event e ON e.id = uv.eventId
				WHERE userId = ? AND eventId = ?
			`
		)
		.get(userId, event);
}

function getEvent(event: string) {
	return db.query<ApplicationEvent, [string]>('SELECT * FROM event WHERE id = ?').get(event);
}

function ensureTrack(userId: string, trackId: string) {
	let userTrack = db
		.query<ApplicationUserTrack, [string, string]>(
			`
				SELECT *
				FROM application_user_track
				WHERE userId = ? AND trackId = ?
			`
		)
		.get(userId, trackId);

	if (!userTrack) {
		userTrack = db
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

function getSteps(userTrackId: string, trackId: string) {
	type StepWithStatus = ApplicationStep & { completedAt: string | null };
	return db
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
