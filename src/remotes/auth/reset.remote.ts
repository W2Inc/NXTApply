// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import { RESEND_EMAIL } from '$env/static/private';
import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';
import { FormKit } from '$lib/form.svelte';
import Logger from '$lib/logger';
import { randomWait } from '$lib/utils';
import { Auth } from '@/server/auth';
import { sqlite } from '@/server/db';
import { resend } from '@/server/email';
import type { User } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { z } from 'zod/v4';

// ============================================================================

// const mail = (url: URL) => `
// <!DOCTYPE html>
// <html>
// <head>
// 	<meta charset="utf-8">
// 	<meta name="viewport" content="width=device-width, initial-scale=1.0">
// 	<title>[${PUBLIC_APP_NAME}] Reset Your Password</title>
// </head>
// <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
// 	<div style="text-align: center; margin-bottom: 30px;">
// 		<h1 style="color: #2c3e50;">W2Inc</h1>
// 	</div>

// 	<p>Hello,</p>
// 	<p>We received a request to reset your password. Click the button below to create a new password:</p>
// 	<div style="text-align: center; margin: 30px 0;">
// 		<a href="${url.toString()}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
// 	</div>

// 	<p>If you didn't request a password reset, you can safely ignore this email.</p>
// 	<p>For security reasons, this link will expire in ${Auth.RESET_HOURS_VALID} hours.</p>

// 	<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
// 		<p>This is an automated email from ${PUBLIC_APP_NAME}. Please do not reply to this message.</p>
// 		<p>&copy; ${new Date().getFullYear()} W2Inc. All rights reserved.</p>
// 	</div>
// </body>
// </html>
// `;

// ============================================================================

const schema = z.object({
	token: z.base64url(),
	password: z.string().min(4).max(256),
	confirm: z.string().min(4).max(256)
});

// ============================================================================

export const reset = FormKit.declare(schema, async (data) => {
	await randomWait();

	// const [user] = await sqlite<User[]>`SELECT * FROM user WHERE email = ${data.email}`;
	// if (!user || !user.hash || user.provider) {
	// 	error(422);
	// }

	// const token = await Auth.reset(user.id);
	// const url = new URL(`${PUBLIC_APP_URL}/auth/reset?token=${encodeURIComponent(token)}`);
	// const { error: e } = await resend.emails.send({
	// 	from: `${PUBLIC_APP_NAME} <portal@resend.dev>`,
	// 	to: [dev ? RESEND_EMAIL : user.email],
	// 	subject: 'Password Reset Request',
	// 	html: mail(url)
	// });

	// if (!e) {
	// 	return FormKit.Reply.NoContent();
	// }

	// Logger.err(e);
	// error(500);
});
