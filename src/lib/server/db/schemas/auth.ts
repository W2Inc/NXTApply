// ============================================================================
// W2Inc, Amsterdam 2024, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text, int,  } from 'drizzle-orm/sqlite-core';

// ============================================================================

/** Database sessions */
export const sessions = sqliteTable("sessions", {
	id: text("id", { length: 255 }).primaryKey(),
	userId: text("user_id").notNull(),
	expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
});

export type Sessions = InferSelectModel<typeof sessions>;

export const resetTokens = sqliteTable("reset_tokens", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull(),
	expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
});

export type ResetTokens = InferSelectModel<typeof resetTokens>;

export const verificationTokens = sqliteTable("verification_tokens", {
	id: int("id").primaryKey({ autoIncrement: true }).notNull(),
	code: text("code").notNull(),
	email: text("email").notNull(),
	userId: text("user_id").unique().notNull(),
	expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
});

export type VerificationTokens = InferSelectModel<typeof verificationTokens>;
