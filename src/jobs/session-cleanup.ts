declare var self: Worker;

import { Database } from 'bun:sqlite';
import { getLocalTimeZone, now } from '@internationalized/date';
import { SQL } from 'bun';
import { UTC } from '$lib/utils';

const date = now(getLocalTimeZone());
const sql = new SQL(Bun.env.DATABASE_URL);
self.postMessage({ message: 'Worker Job Started' });
await sql`DELETE FROM session WHERE expiresAt < ${UTC.write(date)}`;
self.postMessage({ message: 'Worker Job Completed' });
process.exit(0);
