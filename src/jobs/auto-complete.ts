// ============================================================================
// W2Inc, Amsterdam 2024, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

/*
  Daily job:
  - Find events with autoComplete = true whose startsAt is in the past
  - For every related user_event without a completion timestamp, set completedAt = unixepoch('now')
*/

declare var self: Worker;
import { Database } from 'bun:sqlite';

using db: Database = new Database(Bun.env.DATABASE_URL, {
	strict: true
});

self.postMessage({ message: 'Worker Job Started' });

const result = db.run(`
	UPDATE user_event
	SET completedAt = datetime('now')
	WHERE completedAt IS NULL
		AND eventId IN (
			SELECT id
			FROM event
			WHERE autoComplete = 1
			AND unixepoch(startsAt) <= unixepoch()
		)
`);
self.postMessage({
	message: `Modified: ${result.changes} rows`
});
self.postMessage({
	message: 'Worker Job Completed'
});

process.exit(0);
