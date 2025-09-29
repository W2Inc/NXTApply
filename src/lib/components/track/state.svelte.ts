// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import type { ISO } from "$lib/utils";
import type { ApplicationStep, ApplicationTrack } from "@prisma/client";

// ============================================================================

export const TRACK_KEY = Symbol('Track State Symbol');
export type CombinedTrack = ISO<ApplicationTrack> & {
	steps: ISO<ApplicationStep>[]
};

export type WaitingConditional = {
	granularity: "hour" | "day" | "minute",
	value: number;
};
