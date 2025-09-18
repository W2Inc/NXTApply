import { sqlite } from "$lib/server/db";
import type { ApplicationEvent, ApplicationUserStep, ApplicationUserTrack, User } from "@prisma/client";
import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ locals }) => {
	const id = locals.session.userId;
	await sqlite.transaction(async (tx) => {
		const tracks = await tx<ApplicationUserTrack[]>`SELECT id FROM application_user_track WHERE userId = ${id}`;
		for (const track of tracks) {
			await tx`DELETE FROM application_user_step WHERE userTrackId = ${track.id}`;
		}
		await tx`DELETE FROM application_user_track WHERE userId = ${id}`;
		await tx`DELETE FROM user_event WHERE userId = ${id}`;
		await tx`DELETE FROM session WHERE userId = ${id}`;
		await tx`DELETE FROM user WHERE id = ${id}`;
	});

	redirect(303, '/auth/sign-in');
};

export const GET: RequestHandler = async ({ locals }) => {
	const id = locals.session.userId;

	const tracks = db
		.query<ApplicationUserTrack, [string]>('SELECT * FROM application_user_track WHERE userId = ?')
		.all(id);

	const steps = tracks.map((track) => ({
		trackId: track.id,
		steps: db
			.query<ApplicationUserStep, [string]>('SELECT * FROM application_user_step WHERE userTrackId = ?')
			.all(track.id)
	}));

	const events = db.query<ApplicationEvent, [string]>('SELECT * FROM user_event WHERE userId = ?').all(id);
	const user = db.query<User, [string]>('SELECT * FROM user WHERE id = ?').get(id)!;
	if (user) {
		// Don't give these out, not needed anyway.
		delete (user as Partial<User>).hash;
		delete (user as Partial<User>).tfa;
	}

	return Response.json({ tracks, steps, events, user }, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': 'attachment; filename="gdpr-data.json"'
		}
	});
};