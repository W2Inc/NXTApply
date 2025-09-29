import { query } from "$app/server";
import type { ISO } from "$lib/utils";
import { sqlite } from "@/server/db";
import type { ApplicationEvent } from "@prisma/client";
import { error } from "@sveltejs/kit";
import z from "zod";

export const getEvent = query(z.string(), async (id) => {
	const [ event ] = await sqlite<ISO<ApplicationEvent>[]>`
		SELECT * FROM event WHERE id = ${id}
	`;

	if (!event) error(404);
	return event;
});
