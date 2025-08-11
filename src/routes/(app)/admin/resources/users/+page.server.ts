import type { ApplicationEvent, EventTypeDependency, User, UserEvent } from "@prisma/client";
import type { PageServerLoad, Actions } from "./$types";
import { get } from "svelte/store";
import { UserFlag } from "$lib";
import { db } from "$lib/server/db";
import { Pagination } from "$lib/paginate.svelte";

// ============================================================================

function getStats() {
	return db
		.query<{
			averageAge: number,
			userCount: number,
			activeUsers: number,
			thirdParty: number,
		}, [number]>(`
			SELECT
				AVG((julianday('now') - julianday(dob)) / 365.2425) AS averageAge,
				COUNT(*) AS userCount,
				(
					SELECT COUNT(DISTINCT userId)
					FROM session
					WHERE expiresAt > strftime('%s','now')
				) AS activeUsers,
				(
					SELECT COUNT(*)
					FROM user
					WHERE flags & ?1 != 0
				) AS thirdParty
			FROM user
			WHERE dob IS NOT NULL AND flags & ?1 != 0
		`)
		.get(UserFlag.IsAdmin);
}

// ============================================================================


export type UserResult = {
} & User;

export const load: PageServerLoad = ({ locals, url, params }) => {
	const page = url.searchParams.get('page') ?? undefined;

	return {
		stats: getStats(),
		users: Pagination.query<UserResult>(`
			SELECT * FROM user WHERE flags & ? != 0
			ORDER BY createdAt DESC
		`, { page }, UserFlag.IsAdmin)
	}
};

// ============================================================================

// export type FormOutput = Formy.Output<typeof actionSchema>;
// const actionSchema = z.object({
// 	id: z.string()
// });


// export const actions: Actions = {
// 	remove: async ({ request, locals }) => {
// 		const result = await Formy.parse(request, actionSchema, locals.locale);
// 		if (result.error) {
// 			return Formy.fail(400, result);
// 		}

// 		const deleteAll = locals.db.transaction((eventId: string) => {
// 			locals.db.query<UserEvent, [string]>("DELETE FROM user_event WHERE eventId = ?").run(eventId);
// 			locals.db.query<EventTypeDependency, [string]>("DELETE FROM event_type_dependency WHERE eventId = ?").run(eventId);
// 			locals.db.query<ApplicationEvent, [string]>("DELETE FROM event WHERE id = ?").run(eventId);
// 		});

// 		deleteAll(result.data.id);
// 		return Formy.success("Event and all dependencies deleted successfully.");
// 	},
// };
