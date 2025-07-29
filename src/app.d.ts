// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			locale: string;
			tz: string;
			db: import('bun:sqlite').Database;
			session: import('@prisma/client').Session | null;
			user: import('@prisma/client').User | null;
		}
		interface PageData {
			locale: string;
			tz: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
