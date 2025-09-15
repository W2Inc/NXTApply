// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import z from 'zod';
import { query } from '$app/server';
import { sqlite } from '$lib/server/db';
import type { User } from '@prisma/client';
import type { ISO } from '$lib/utils';

// ============================================================================

export const getUser = query(z.base64url(), async (id) => {
	const [user] = await sqlite<ISO<User[]>>`SELECT * FROM user WHERE id = ${id}`;
	return user;
});
