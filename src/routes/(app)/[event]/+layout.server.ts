// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type {
	ApplicationEvent,
	ApplicationStep,
	ApplicationUserTrack,
	UserEvent
} from '@prisma/client';
import { sqlite } from '@/server/db';
import type { ISO } from '$lib/utils';
import { sql } from 'bun';

// ============================================================================

// Type definitions for extended database entities
type UserEventWithTrack = ISO<UserEvent> & { trackId: string | null };
type StepWithStatus = ISO<ApplicationStep> & { completedAt: string | null };

async function ensureTrack(locals: App.Locals, trackId: string) {
	const userId = locals.session.userId;
	let [userTrack] = await sqlite<ISO<ApplicationUserTrack>[]>`
		SELECT * FROM application_user_track
		WHERE userId = ${userId} AND trackId = ${trackId}
	`;

	if (!userTrack) {
		const id = Bun.randomUUIDv7('base64url');
		[userTrack] = await sqlite<ISO<ApplicationUserTrack>[]>`
			INSERT INTO application_user_track ${sql({ id, userId, trackId })}
			RETURNING *
		`;
	}

	return userTrack!;
}

// ============================================================================

export const load: LayoutServerLoad = async ({ locals, params, url }) => {
	const [userEvent] = await sqlite<UserEventWithTrack[]>`
		SELECT uv.*, e.trackId
		FROM user_event uv
		LEFT JOIN event e ON e.id = uv.eventId
		WHERE uv.userId = ${locals.session.userId} AND uv.eventId = ${params.event}
	`;

	if (!userEvent) error(404, 'User event not found');
	if (userEvent.completedAt) {
		redirect(303, '/');
	}

	// No track associated, return the event directly
	if (!userEvent.trackId) {
		const [event] = await sqlite<ISO<ApplicationEvent>[]>`
			SELECT * FROM event WHERE id = ${userEvent.eventId}
		`;

		// NOTE(W2): Event can't be missing else we messed up badly
		return { userEvent, event: event ?? error(500, 'Event not found') };
	}

	// Handle track-based events
	const userTrack = await ensureTrack(locals, userEvent.trackId);
	if (userTrack.completedAt) {
		await sqlite`
			UPDATE user_event
			SET completedAt = COALESCE(completedAt, CURRENT_TIMESTAMP)
			WHERE id = ${userEvent.id}
		`;

		redirect(303, '/');
	}

	const steps = await sqlite<StepWithStatus[]>`
		SELECT s.*, us.completedAt
		FROM application_step s
		LEFT JOIN application_user_step us
			ON us.stepId = s.id AND us.userTrackId = ${userTrack.id}
		WHERE s.trackId = ${userEvent.trackId}
		ORDER BY s."order"
	`;

	const currentStep = steps.find((step) => step.completedAt === null);
	if (currentStep) {
		const targetPath = `/${userEvent.eventId}/${currentStep.id}`;
		// Redirect to the current step if not already there
		if (url.pathname !== targetPath) {
			redirect(303, targetPath);
		}

		const [event] = await sqlite<ISO<ApplicationEvent>[]>`
			SELECT * FROM event WHERE id = ${userEvent.eventId}
		`;

		return {
			steps,
			step: currentStep,
			userEvent,
			event: event ?? error(500, 'Event not found')
		};
	}

	// All steps are completed - mark track and event as complete
	await sqlite.transaction(async (tx) => {
		await tx`
			UPDATE application_user_track
			SET completedAt = COALESCE(completedAt, CURRENT_TIMESTAMP)
			WHERE id = ${userTrack.id}
		`;

		await tx`
			UPDATE user_event
			SET completedAt = COALESCE(completedAt, CURRENT_TIMESTAMP)
			WHERE id = ${userEvent.id}
		`;
	});

	// Redirect to home after completing everything
	redirect(303, '/');
};
