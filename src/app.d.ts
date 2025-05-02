// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User, Sessions } from "$lib/server/db/schemas";

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Sessions;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
