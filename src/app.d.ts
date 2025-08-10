// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// db: import('bun:sqlite').Database;
			locale: string;
			session: import('@prisma/client').Session;
		}
		interface PageData {

		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
