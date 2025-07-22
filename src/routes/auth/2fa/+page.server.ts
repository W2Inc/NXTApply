// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { verifyTOTPWithGracePeriod } from '@oslojs/otp';
import { Auth } from '$lib/auth.svelte';
import { z } from 'zod/v4';
import type { User } from '@prisma/client';
import { Formy } from '$lib/index.svelte';
import Form from '$lib/ui/form/form.svelte';

// ============================================================================

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.session) {
		return redirect(307, `/${locals.locale}`);
	}
	if (!cookies.get(Auth.IDENTITY_COOKIE)) {
		return error(401, 'Unauthorized');
	}
	return {};
};

// ============================================================================

export type FormOutput = Formy.Output<typeof schema>;
const schema = z.object({
	otp: z.string()
});

// ============================================================================

export const actions: Actions = {
	default: async ({ cookies, request, locals }) => {
		const userId = cookies.get(Auth.IDENTITY_COOKIE);
		if (!userId) {
			error(401);
		}

		const result = await Formy.parse(request, schema);
		if (result.error) {
			return Formy.fail(400, result);
		}

		if (!result.data.otp) {
			cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
			error(401);
		}

		const user = locals.db.query<User, string>('SELECT * FROM user WHERE id = ?').get(userId);
		if (!user || user.id !== userId) {
			cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
			error(401);
		}
		if (!user.tfa) {
			redirect(307, `/${locals.locale}/auth/2fa/setup`);
		}

		cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
		const valid = verifyTOTPWithGracePeriod(
			Buffer.from(user.tfa, 'hex'),
			Auth.OTP_INTERVAL_SECONDS,
			Auth.OTP_DIGIT_LENGTH,
			result.data.otp,
			30
		);

		if (!valid) {
			return Formy.fail(400, Formy.Issues.InvalidOTP);
		}

		const token = Auth.generateToken();
		await Auth.createSession(locals, token, userId);
		Auth.setCookie(cookies, token);
		redirect(302, `/${locals.locale}`);
	}
};
