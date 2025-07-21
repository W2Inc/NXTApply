import type z from "zod/v4";

export const UserFlag = {
	IsAdmin: 1 << 2,
	CompletedBoarding: 1 << 3,
} as const;

export type FormErrorObject<S extends z.ZodObject> = Record<keyof z.infer<S>, string[]>
export type FormOutputObject<S extends z.ZodObject> = { errors: FormErrorObject<S>, loading: boolean }
