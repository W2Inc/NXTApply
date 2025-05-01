// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { drizzle } from 'drizzle-orm/bun-sqlite';
import Database from 'bun:sqlite';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// ============================================================================

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const connection = new Database(env.DATABASE_URL);
export const db = drizzle(connection, { schema });
