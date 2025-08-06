import type z from 'zod/v4';

export namespace FormHelper {
	export async function parse<T>(
		request: Request | FormData,
		schema: z.ZodType<T>,
		locale: string = 'en'
	) {
		const rawForm = request instanceof Request ? await request.formData() : request;

		/** @ts-ignore We know, no worries if it isn't there we just go back to english*/
		const zodLocale = zLocales[locale] ?? zLocales['en'];
		return schema.safeParseAsync(Object.fromEntries(rawForm.entries()), {
			error: zodLocale().localeError
		});
	}
}
