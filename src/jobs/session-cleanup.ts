// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

declare var self: Worker;

import { SQL } from 'bun';
import { UTC } from '$lib/utils';

// ============================================================================

const sql = new SQL(Bun.env.DATABASE_URL);
self.postMessage({ message: 'Worker Job Started' });
await sql`DELETE FROM session WHERE expiresAt < ${UTC.write(UTC.now())}`;
self.postMessage({ message: 'Worker Job Completed' });
process.exit(0);
