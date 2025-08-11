// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import * as v from 'valibot';
import { form, getRequestEvent } from '$app/server';
import { FormKit } from '$lib/form.svelte';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { ApplicationEvent, User } from '@prisma/client';
import { UserFlag } from '$lib';

// ============================================================================

type UserUpdateOuput = FormKit.FormResult<typeof userUpdateSchema>;
const userUpdateSchema = v.object({
	id: v.string(),
	dob: v.pipe(v.string(), v.isoDateTime()),
	// gender: v.nullable(v.pipe(v.number(), v.minValue(0), v.maxValue(2))),
	// country: v.nullable(v.string()),
	// flags: v.nullable(v.number()),
	// firstName: v.nullable(v.string()),
	// lastName: v.nullable(v.string()),
	// phone: v.nullable(v.string())
});

// ============================================================================

// Update user fields, only updating non-null values using COALESCE
const qUpdateUser = db.prepare<
	User,
	[
		string | null, // email
		string | null, // dob
		number | null, // gender
		string | null, // country
		number | null, // flags
		string | null, // firstName
		string | null, // lastName
		string | null, // phone
		string // id
	]
>(
	`UPDATE user SET
		email = COALESCE(?, email),
		dob = COALESCE(?, dob),
		gender = COALESCE(?, gender),
		country = COALESCE(?, country),
		flags = COALESCE(?, flags),
		firstName = COALESCE(?, firstName),
		lastName = COALESCE(?, lastName),
		phone = COALESCE(?, phone),
		updatedAt = CURRENT_TIMESTAMP
	WHERE id = ?`
);

// ============================================================================

export const updateUser = form<UserUpdateOuput>(async (data) => {
	const { locals } = getRequestEvent();
	db.query<User, [string, number]>(
		'SELECT * FROM user WHERE id = ? AND (flags & ?) != 0'
	).get(locals.session.userId, UserFlag.IsAdmin) ?? error(401);

	const form = await FormKit.parse(data, userUpdateSchema);
	if (!form.success) return FormKit.invalid(form);

	// console.log('Updating user:', form.output);

	// qUpdateUser.run(
	// 	form.output.email,
	// 	form.output.dob,
	// 	form.output.gender,
	// 	form.output.country,
	// 	form.output.flags,
	// 	form.output.firstName,
	// 	form.output.lastName,
	// 	form.output.phone,
	// 	form.output.id
	// );

	FormKit.success()
});
