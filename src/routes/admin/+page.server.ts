// ============================================================================
// W2Inc, Amsterdam 2023, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { get } from "svelte/store";
import type { PageServerLoad } from "./$types";

// ============================================================================

type Metric = {
	current: number;
	previous: number;
};

function getUserMetrics(): Metric {
	return {
		current: 0,
		previous: 0,
	};
}

function getSessionMetrics(): Metric {
	return {
		current: 0,
		previous: 0,
	};
}

// ============================================================================

export const load: PageServerLoad = async ({ }) => {
	return {
		userMetrics: getUserMetrics(),
		sessionMetrics: getSessionMetrics(),
	}
};