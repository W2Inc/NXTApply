import { int } from 'drizzle-orm/sqlite-core';
import { DateTime } from 'luxon';

export const timestamps = {
	updatedAt: int({ mode: 'timestamp_ms' })
		.default(DateTime.now().toJSDate()),
	createdAt: int({ mode: 'timestamp_ms' })
		.default(DateTime.now().toJSDate())
		.$onUpdate(() => DateTime.now().toJSDate())
		.notNull()
};
