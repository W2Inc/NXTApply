declare var self: Worker;

import { Database } from 'bun:sqlite';
import { getLocalTimeZone, now } from '@internationalized/date';

const date = now(getLocalTimeZone());
using db: Database = new Database(Bun.env.DATABASE_URL, {
	strict: true,
});

self.postMessage({ message: 'Worker Job Started' });
db.run(`DELETE FROM session WHERE expiresAt < ?`, [date.toDate().getTime()]);
self.postMessage({ message: 'Worker Job Completed' });
process.exit(0);
