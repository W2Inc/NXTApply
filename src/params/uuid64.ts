import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => {
	if (!/^[A-Za-z0-9\-_]+=*$/.test(param)) {
		return false;
	}

	try {
		const decoded = Buffer.from(param, 'base64url')
			.toString('hex')
			.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
		return /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(decoded);
	} catch {
		return false;
	}
};
