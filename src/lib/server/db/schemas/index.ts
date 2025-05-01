// ============================================================================
// W2Inc, Amsterdam 2024, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { timestamps } from './utils';
import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';
export * as auth from "./auth";

// ============================================================================

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	verified: int("verified", { mode: "boolean" }).default(false),
	hash: text("hash"),
	tfa: text("tfa"),
	...timestamps
});
