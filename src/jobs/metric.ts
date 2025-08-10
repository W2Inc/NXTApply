declare var self: Worker;

import { Database } from 'bun:sqlite';
import { getLocalTimeZone, now } from '@internationalized/date';

const date = now(getLocalTimeZone());
using db: Database = new Database(Bun.env.DATABASE_URL, {
	strict: true,
});

self.postMessage({ message: 'Worker Job Started' });

db.run(
	`INSERT INTO user_metrics (year, month, userCount, completedTracks)
	 SELECT ?, ?,
		(SELECT COUNT(*) FROM user),
		(SELECT COUNT(*) FROM user_track WHERE completedAt IS NOT NULL)
	 WHERE NOT EXISTS (
		SELECT 1 FROM user_metrics WHERE year = ? AND month = ?
	 )`,
	[date.year, date.month, date.year, date.month]
);

self.postMessage({ message: 'Worker Job Completed' });
process.exit(0);
