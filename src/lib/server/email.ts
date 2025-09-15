// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { Resend } from 'resend';
import { RESEND_SECRET } from '$env/static/private';

// ============================================================================

export const resend = new Resend(RESEND_SECRET);
