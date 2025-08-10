// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { Database } from 'bun:sqlite';
import { DATABASE_URL } from '$env/static/private';

// ============================================================================

export const db: Database = new Database(DATABASE_URL, { strict: true });
