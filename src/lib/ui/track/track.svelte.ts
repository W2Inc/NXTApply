import type { ApplicationStep } from '@prisma/client';

let steps = $state<ApplicationStep[]>([]);

export const track = {
  get steps() { return steps },
  set steps(value) { steps = value },
};
