// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Sessions } from "$lib/server/db/schemas";

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session?: Sessions;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
