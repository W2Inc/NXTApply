// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { dev } from '$app/environment';
import { form } from '$app/server';
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

const mail = (url: URL) => `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>[${PUBLIC_APP_NAME}] Reset Your Password</title>
</head>
<body
	style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<div style="text-align: left; margin: 30px 0;">
		<p>Hello,</p>
		<p>We received a request to reset your password. Click the button below to create a new password:</p>

		<a href="${url.toString()}"
			style="background-color: #3498db; color: white; margin: 30px 0; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset
			Password</a>

		<p>If you didn't request a password reset, you can safely ignore this email.</p>
		<p>For security reasons, this link will expire in ${Auth.RESET_HOURS_VALID} hours.</p>

		<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
			<p>This is an automated email from ${PUBLIC_APP_NAME}. Please do not reply to this message.</p>
			<p>&copy; ${new Date().getFullYear()} W2Inc. All rights reserved.</p>
		</div>
	</div>
</body>
</html>
`;

// ============================================================================

const schema = z.object({
	email: z.email()
});

// ============================================================================

export const forgot = FormKit.declare(schema, async (data) => {
	await randomWait();

	const response = FormKit.Reply.Ok({ message: 'Please check your email.'});
	const [user] = await sqlite<User[]>`SELECT * FROM user WHERE email = ${data.email}`;
	if (!user || !user.hash || !user.verified || user.provider) {
		Logger.dbg('Unable to request password reset for:', user?.id);
		return response;
	}

	const token = await Auth.reset(user.id);
	const url = new URL(`${PUBLIC_APP_URL}/auth/reset?token=${encodeURIComponent(token)}`);
	const { error: e } = await resend.emails.send({
		from: `${PUBLIC_APP_NAME} <portal@resend.dev>`,
		to: [dev ? RESEND_EMAIL : user.email],
		subject: 'Password Reset Request',
		html: mail(url)
	});

	if (!e) {
		return response;
	}

	Logger.err(e);
	error(500);
});
