// ============================================================================
// W2Inc, Amsterdam 2024, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { InferSelectModel } from 'drizzle-orm';
import { id, timestamps } from './utils';
import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { db } from '..';
export * from "./auth";

// ============================================================================

export const users = sqliteTable("users", {
	...id,
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

// Stages
// ============================================================================

export const stages = sqliteTable("stages", {
	...id,
	userId: text("user_id").notNull().references(() => users.id),
	type: text("type").notNull(),
	level: int("level").notNull().default(0),
	...timestamps
});

export const stagesRelations = relations(stages, ({ one }) => ({
	user: one(users, {
		fields: [stages.userId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	stages: many(stages),
}));

export type Stage = InferSelectModel<typeof stages>;
