import type { ApplicationStep, ApplicationTrack } from '@prisma/client';

type ApplicationUserStep = ApplicationStep & { completedAt: Date | null };

let data = $state<ApplicationTrack>()!;
let steps = $state<ApplicationUserStep[]>([]);

export const track = {
	get data() {
		return data;
	},
	set data(value) {
		data = value;
	},

	get steps() {
		return steps;
	},
	set steps(value) {
		steps = value;
	}
};
