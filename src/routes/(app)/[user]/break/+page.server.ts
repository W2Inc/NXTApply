import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	const { db, user } = locals;

	if (!user) {
		return {
			status: 302,
			redirect: "/"
		};
	}

	// Check if user has completed the track
	const trackCompletion = db
		.query<{ id: string }, [string]>(
			`SELECT id FROM track_completion WHERE userId = ? LIMIT 1`
		)
		.get(user.id);

	if (trackCompletion) {
		return {
			status: 302,
			redirect: "/"
		};
	}

	// Get the user's current step (find the first step in a track that the user is in)
	const currentStep = db
		.query<{ id: string; type: number }, [string, string]>(
			`
			SELECT s.id, s.type
			FROM application_step s
			INNER JOIN application_track t ON s.trackId = t.id
			INNER JOIN user u ON u.id = ?
			WHERE t.id = (
				SELECT trackId FROM user WHERE id = ?
			)
			LIMIT 1
			`
		)
		.get(user.id, user.id);

	if (!currentStep || currentStep.type !== 2) {
		return redirect(302, "/");
	}
	return { };
};

export const actions: Actions = {
	default: async ({ }) => {

	}
};
