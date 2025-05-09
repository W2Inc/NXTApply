// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { users } from "$lib/server/db/schemas";
import { IDENTITY_COOKIE, OTP_DIGIT_LENGTH, OTP_INTERVAL_SECONDS } from ".";
import { verifyTOTPWithGracePeriod } from "@oslojs/otp";
import { Auth } from "$lib/server/auth";
import { Toasty } from "$lib";

// ============================================================================

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.session) {
		return redirect(307, "/");
	}
	if (!cookies.get(IDENTITY_COOKIE)) {
		return error(401, "Unauthorized");
	}
	return {};
};

// ============================================================================

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const userId = cookies.get(IDENTITY_COOKIE);
		if (!userId) {
			error(401);
		}

		const formData = await request.formData();
		const otp = formData.get("otp")?.toString();
		if (!otp) {
			cookies.delete(IDENTITY_COOKIE, { path: "/" });
			error(401);
		}

		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!user || user.id !== userId) {
			cookies.delete(IDENTITY_COOKIE, { path: "/" });
			error(401);
		}
		if (!user.tfa) {
			redirect(307, "/auth/2fa/setup");
		}

		cookies.delete(IDENTITY_COOKIE, { path: "/" });
		const valid = verifyTOTPWithGracePeriod(
			Buffer.from(user.tfa, "hex"),
			OTP_INTERVAL_SECONDS,
			OTP_DIGIT_LENGTH,
			otp,
			30
		)

		if (!valid) {
			return Toasty.fail(400, "Invalid OTP");
		}

		const token = Auth.generateToken();
		await Auth.createSession(token, userId);
		Auth.setCookie(cookies, token);
		redirect(302, "/");
	},
};
