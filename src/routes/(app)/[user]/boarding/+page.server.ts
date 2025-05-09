import { areNull, Toasty } from '$lib';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas';
import { CalendarDate, getLocalTimeZone, now, parseDate } from '@internationalized/date';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const fn = formData.get('first_name')?.toString() ?? null;
		const ln = formData.get('last_name')?.toString() ?? null;
		const dob = formData.get('dob')?.toString() ?? null;
		const gender = formData.get('dob')?.toString() ?? null;
		const phone = formData.get('phone')?.toString() ?? null;

		console.log(JSON.stringify(formData));

		if ([fn, ln, dob, gender, phone].some((v) => v === null || v.length === 0))
			return Toasty.fail(422, 'Not all required fields are set.');
		try {
			const today = now(getLocalTimeZone());
			const date = parseDate(dob!);

			// Verify user is at least 18 years old
			const eighteenYearsAgo = today.subtract({ years: 18 });
			if (date.compare(eighteenYearsAgo) > 0) {
				return Toasty.fail(422, 'You must be at least 18 years old to continue.');
			}


		} catch (error) {
			return Toasty.fail(500, "Something went wrong...")
		}

		// await db.update(users).set({
		// 	first_name: fn!,
		// 	last_name: ln!,

		// });
		return Toasty.success('Information set!');
	}
};
