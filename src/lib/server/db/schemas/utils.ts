import { int } from 'drizzle-orm/sqlite-core';
import { now, getLocalTimeZone } from "@internationalized/date";

export const timestamps = {
	updatedAt: int({ mode: 'timestamp' })
		.default(now(getLocalTimeZone()).toDate()),
	createdAt: int({ mode: 'timestamp' })
		.default(now(getLocalTimeZone()).toDate())
		.$onUpdate(() => now(getLocalTimeZone()).toDate())
		.notNull()
};
