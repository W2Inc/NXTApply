// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { User } from '@prisma/client';
import { query, getRequestEvent } from '$app/server';
import { Pagination } from '$lib/server/paginate.svelte';
import z from 'zod/v4';

// ============================================================================

/** Gets a paginated amount of users. */
export const getUsers = query(Pagination.schema.optional(), (page) => {
	const { locals } = getRequestEvent();

	return Pagination.paginate<User>(`
		SELECT * FROM user
	`, locals, page);
});

/** Get user by ID */
export const getUser = query(z.base64url(), (id) => {
	const { locals } = getRequestEvent();

	return locals.db.query<User, [string]>(`
		SELECT * FROM user WHERE id = ?
	`).get(id);
});

// ============================================================================
