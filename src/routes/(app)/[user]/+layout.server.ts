import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { areNull } from '$lib';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	return {};
};
