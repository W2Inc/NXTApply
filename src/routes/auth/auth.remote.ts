// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import { form, getRequestEvent } from '$app/server';
import { RESEND_EMAIL } from '$env/static/private';
import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';
import { Auth } from '$lib/auth.svelte';
import { FormKit } from '$lib/form.svelte';
import { db } from '$lib/server/db';
import { resend } from '$lib/server/email';
import { logger } from '$lib/server/log';
import { verifyTOTPWithGracePeriod } from '@oslojs/otp';
import type { ResetToken, User } from '@prisma/client';
import { error, redirect, type Cookies } from '@sveltejs/kit';
import * as v from 'valibot';

// ============================================================================

// Wait a random 25 - 400 ms to prevent timing attacks
// Returning immediately allows malicious actors to figure out valid usernames from response times
// By always returning the same / inconsistent response time, we can make it harder to figure out valid usernames
const deny = () => new Promise((resolve) => setTimeout(resolve, 25 + Math.random() * 400));

const deleteOTPCookies = (cookies: Cookies) => {
	cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
	cookies.delete(Auth.OTP_KEY_COOKIE, { path: '/' });
};

// ============================================================================
// Sign(in/up/out)
// ============================================================================

type SignInOutput = FormKit.FormResult<typeof signInSchema>;
const signInSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(1, 'Password is required'))
});

type SignUpOutput = FormKit.FormResult<typeof signUpSchema>;
const signUpSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(4), v.maxLength(256)),
	confirm: v.pipe(v.string(), v.minLength(4), v.maxLength(256)),
	first: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
	last: v.pipe(v.string(), v.minLength(1), v.maxLength(256))
});

// ============================================================================

/** Sign in a user */
export const signin = form<SignInOutput>(async (data) => {
	const form = await FormKit.parse(data, signInSchema);
	if (!form.success) return FormKit.invalid(form);

	await deny();
	const { cookies } = getRequestEvent();
	const user = db
		.query<User, [string]>(/** @wc-ignore */ 'SELECT * FROM user WHERE email = ?')
		.get(form.output.email);

	if (!user || !user.hash) {
		error(422, FormKit.Issues.InvalidCredentials.toString());
	}

	const match = await Bun.password.verify(form.output.password, user.hash);
	if (!match) {
		error(422, FormKit.Issues.InvalidCredentials.toString());
	}

	cookies.set(Auth.IDENTITY_COOKIE, user.id, {
		path: '/',
		secure: !dev,
		sameSite: 'strict'
	});

	redirect(302, `/auth/2fa/setup`);
});

/** Sign up a user */
export const signup = form<SignUpOutput>(async (data) => {
	const form = await FormKit.parse(data, signUpSchema);
	if (!form.success) return FormKit.invalid(form);

	await deny();
	if (form.output.password !== form.output.confirm)
		error(422, `${FormKit.Issues.InvalidCredentials}`);

	const existingUser = db
		.query<User, [string]>('SELECT * FROM user WHERE email = ?')
		.get(form.output.email);

	if (existingUser) {
		error(409);
	}

	const id = Bun.randomUUIDv7('base64url');
	const hash = await Bun.password.hash(form.output.password, 'argon2id');
	db.run('INSERT INTO user (id, hash, email, firstName, lastName) VALUES (?, ?, ?, ?, ?)', [
		id,
		hash,
		form.output.email,
		form.output.first,
		form.output.last
	]);

	const { cookies } = getRequestEvent();
	cookies.set('identity', id, {
		path: '/',
		secure: !dev,
		sameSite: 'strict'
	});

	redirect(302, `/auth/2fa/setup`);
});

/** Sign out a user */
export const signout = form(async () => {
	const { locals, cookies } = getRequestEvent();
	Auth.invalidateSession(locals, locals.session.id);
	cookies.delete(Auth.SESSION_COOKIE, { path: '/' });
	redirect(303, '/auth/sign-in');
});

// ============================================================================
// Password Reset
// ============================================================================

type ForgotOuptut = FormKit.FormResult<typeof forgotSchema>;
const forgotSchema = v.object({
	email: v.pipe(v.string(), v.email())
});

type ResetOutput = FormKit.FormResult<typeof resetSchema>;
const resetSchema = v.object({
	token: v.optional(v.string()),
	password: v.pipe(v.string(), v.minLength(4), v.maxLength(256)),
	confirm: v.pipe(v.string(), v.minLength(4), v.maxLength(256))
});

// ============================================================================

export const forgot = form<ForgotOuptut>(async (data) => {
	const form = await FormKit.parse(data, forgotSchema);
	if (!form.success) return FormKit.invalid(form);

	await deny();
	const user = db
		.query<User, [string]>('SELECT * FROM user WHERE email = ?')
		.get(form.output.email);

	if (!user) return FormKit.success();
	if (user.provider) {
		error(422, `${FormKit.Issues.UnableToReset}`);
	}

	const { locals } = getRequestEvent();
	const token = await Auth.createResetToken(locals, user.id);
	const resetLink = `${PUBLIC_APP_URL}/auth/reset?token=${encodeURIComponent(token)}`;
	const { error: e } = await resend.emails.send({
		from: `${PUBLIC_APP_NAME} <portal@resend.dev>`,
		to: [dev ? RESEND_EMAIL : user.email],
		subject: 'Password Reset Request',
		html: `<p>Click the link below to reset your password:</p>
				 <p><a href="${resetLink}">${resetLink}</a></p>`
	});

	if (e) {
		logger.error(e);
		error(500);
	}

	return FormKit.success();
});

export const reset = form<ResetOutput>(async (data) => {
	const form = await FormKit.parse(data, resetSchema);
	if (!form.success) return FormKit.invalid(form);

	const { password, confirm, token } = form.output;
	if (password !== confirm) {
		error(422, `${FormKit.Issues.InvalidCredentials}`);
	}
	if (!token) {
		error(400, `${FormKit.Issues.InvalidToken}`);
	}

	// Validate reset token and get userId
	const resetToken = db
		.query<ResetToken, [string]>('SELECT * FROM reset_token WHERE id = ?')
		.get(token);

	if (!resetToken) {
		error(400, `${FormKit.Issues.InvalidToken}`);
	}

	// Avoid duplicate
	const user = db.query<User, [string]>('SELECT * FROM user WHERE id = ?').get(resetToken.userId);
	if (await Bun.password.verify(password, user?.hash ?? '')) {
		error(422, `${FormKit.Issues.InvalidCredentials}`);
	}

	const tx = db.transaction(async () => {
		if (new Date(resetToken.expiresAt) < new Date()) {
			db.run('DELETE FROM reset_token WHERE id = ?', [token]);
			error(422, `${FormKit.Issues.InvalidToken}`);
		}

		const hash = await Bun.password.hash(password, 'argon2id');
		db.run('UPDATE user SET hash = ? WHERE id = ?', [hash, resetToken.userId]);
		db.run('DELETE FROM reset_token WHERE id = ?', [token]);
	});

	tx();
	redirect(303, '/auth/sign-in');
});

// ============================================================================
// 2FA
// ============================================================================

type OTPOutput = FormKit.FormResult<typeof otpSchema>;
const otpSchema = v.object({
	otp: v.string()
});

export const setOTP = form<OTPOutput>(async (data) => {
	const form = await FormKit.parse(data, otpSchema);
	if (!form.success) return FormKit.invalid(form);

	const { locals, cookies, request } = getRequestEvent();
	const key = cookies.get(Auth.OTP_KEY_COOKIE);
	const userId = cookies.get(Auth.IDENTITY_COOKIE);
	if (!key || !userId) {
		deleteOTPCookies(cookies);
		error(401);
	}

	const valid = verifyTOTPWithGracePeriod(
		Buffer.from(key, 'hex'),
		Auth.OTP_INTERVAL_SECONDS,
		Auth.OTP_DIGIT_LENGTH,
		form.output.otp,
		30
	);

	if (!valid) {
		deleteOTPCookies(cookies);
		error(400, `${FormKit.Issues.InvalidOTP}`);
	}

	deleteOTPCookies(cookies);
	const user = db
		.query<User, [string, string]>('UPDATE user SET tfa = ? WHERE id = ? RETURNING *')
		.get(key, userId);

	if (!user || user.id !== userId) {
		error(401, 'Unauthorized');
	}

	const token = Auth.generateToken();
	await Auth.createSession(locals, token, userId, request.headers.get('user-agent'));
	Auth.setCookie(cookies, token);
	redirect(302, '/');
});

export const verifyOTP = form<OTPOutput>(async (data) => {
	const form = await FormKit.parse(data, otpSchema);
	if (!form.success) return FormKit.invalid(form);

	const { locals, cookies, request } = getRequestEvent();
	const userId = cookies.get(Auth.IDENTITY_COOKIE);
	if (!userId) {
		error(401);
	}

	if (!form.output.otp) {
		cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
		error(401);
	}

	const user = db.query<User, string>('SELECT * FROM user WHERE id = ?').get(userId);
	if (!user || user.id !== userId) {
		cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
		error(401);
	}
	if (!user.tfa) {
		redirect(307, `/auth/2fa/setup`);
	}

	cookies.delete(Auth.IDENTITY_COOKIE, { path: '/' });
	const valid = verifyTOTPWithGracePeriod(
		Buffer.from(user.tfa, 'hex'),
		Auth.OTP_INTERVAL_SECONDS,
		Auth.OTP_DIGIT_LENGTH,
		form.output.otp,
		30
	);

	if (!valid) {
		error(400, `${FormKit.Issues.InvalidOTP}`);
	}

	const token = Auth.generateToken();
	await Auth.createSession(locals, token, userId, request.headers.get('user-agent'));
	Auth.setCookie(cookies, token);
	redirect(302, `/`);
});
