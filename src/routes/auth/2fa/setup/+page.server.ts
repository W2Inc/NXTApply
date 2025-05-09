// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { error, redirect, type Cookies, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { dev } from "$app/environment";
import { renderSVG } from "uqr";
import { createTOTPKeyURI, generateTOTP, verifyTOTP, verifyTOTPWithGracePeriod } from "@oslojs/otp";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schemas";
import { IDENTITY_COOKIE, OTP_DIGIT_LENGTH, OTP_INTERVAL_SECONDS, OTP_KEY_COOKIE, OTP_KEY_LENGTH } from "..";
import { PUBLIC_APP_NAME } from "$env/static/public";
import { Toasty } from "$lib";
import { Auth } from "$lib/server/auth";

// ============================================================================

function cleanupCookies(cookies: Cookies) {
	cookies.delete(IDENTITY_COOKIE, { path: "/" });
	cookies.delete(OTP_KEY_COOKIE, { path: "/" });
}

// ============================================================================

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.session) {
		redirect(302, "/");
	}

	const userId = cookies.get(IDENTITY_COOKIE);
	if (!userId) {
		error(403);
	}

	// Verify the identity
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
	});

	if (!user || user.id !== userId) {
		cleanupCookies(cookies);
		error(401);
	}
	// Already has TFA
	if (user.tfa !== null) {
		redirect(302, "/auth/2fa");
	}

	// const totp = generateTOTP(key, OTP_INTERVAL_SECONDS, OTP_DIGIT_LENGTH);
	const key = crypto.getRandomValues(new Uint8Array(OTP_KEY_LENGTH));
	cookies.set(OTP_KEY_COOKIE, key.toHex(), {
		path: "/",
		httpOnly: true,
		secure: !dev,
	});

	const uri = createTOTPKeyURI(
		PUBLIC_APP_NAME,
		user.email,
		key,
		OTP_INTERVAL_SECONDS,
		OTP_DIGIT_LENGTH
	);

	return {
		secret: uri,
		qr: renderSVG(uri, { border: 2, ecc: "L" }),
	};
};

export const actions: Actions = {
	default: async ({ locals, cookies, request }) => {
		const key = cookies.get(OTP_KEY_COOKIE);
		const userId = cookies.get(IDENTITY_COOKIE);
		if (!key || !userId) {
			cleanupCookies(cookies);
			error(401);
		}

		const formData = await request.formData();
		const otp = formData.get("otp")?.toString();
		if (!otp) {
			return Toasty.fail(422, "Missing Otp code!");
		}

		const valid = verifyTOTPWithGracePeriod(
			Buffer.from(key, "hex"),
			OTP_INTERVAL_SECONDS,
			OTP_DIGIT_LENGTH,
			otp,
			30
		)

		if (!valid) {
			cleanupCookies(cookies);
			return Toasty.fail(400, "Invalid OTP");
		}

		cleanupCookies(cookies);
		const user = await db.update(users)
			.set({ tfa: key })
			.where(eq(users.id, userId))
			.returning()
			.then((result) => result.at(0));

		if (!user || user.id !== userId) {
			error(401, "Unauthorized");
		}

		const token = Auth.generateToken();
		await Auth.createSession(token, userId);
		Auth.setCookie(cookies, token);
		redirect(302, "/");
	},
};
