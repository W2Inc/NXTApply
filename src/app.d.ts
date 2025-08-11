// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// db: import('bun:sqlite').Database;
			/** The server set timezone, use this for everything that requires a timezone */
			tz: string;
			/** The user desired locale */
			locale: string;
			/**
			 * The user session, never null as it's alwasy required, except for on auth pages.
			 * Should not be used there anyway.
			 *
			 * The hooks.server.ts file should intercept any un-authorized requests and ship them to the
			 * login page if need be. On the login page a session is not needed anyway nor should be ever used.
			 */
			session: import('@prisma/client').Session;
		}
		interface PageData {
			tz: string;
			locale: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
