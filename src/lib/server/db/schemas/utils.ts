import { int } from 'drizzle-orm/sqlite-core';
import { now, getLocalTimeZone } from "@internationalized/date";

export const timestamps = {
	updatedAt: int("updated_at", { mode: 'timestamp' })
		.$defaultFn(() => now(getLocalTimeZone()).toDate()),
	createdAt: int("created_at", { mode: 'timestamp' })
		.$defaultFn(() => now(getLocalTimeZone()).toDate())
		.$onUpdate(() => now(getLocalTimeZone()).toDate())
		.notNull()
};
