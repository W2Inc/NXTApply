// ============================================================================
// W2Inc, Amsterdam 2024, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { InferSelectModel } from 'drizzle-orm';
import { timestamps } from './utils';
import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';
export * from "./auth";

// ============================================================================

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	verified: int("verified", { mode: "boolean" }).default(false),
	hash: text("hash"),
	tfa: text("tfa"),
	dob: int("dob", { mode: "timestamp" }),
	gender: int("gender"),
	country: text("country"),
	first_name: text("first_name"),
	last_name: text("last_name"),
	phone: text("phone"),
	...timestamps
});

export type User = InferSelectModel<typeof users>;
