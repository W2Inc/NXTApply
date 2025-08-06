// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { form } from '$app/server';
import z from 'zod/v4';

// ============================================================================

const schema = z.object({
	firstName: z.string().min(1).max(50),
	lastName: z.string().min(1).max(50),
	gender: z.coerce.number().int().min(0).max(2),
	dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
	phone: z
		.string()
		.regex(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)
		.optional(),
});

export const boarding = form(async (data) => {
	const result = await z.safeParseAsync(schema, Object.fromEntries(data.entries()));
	console.log(result);

	return { success: true };
});
