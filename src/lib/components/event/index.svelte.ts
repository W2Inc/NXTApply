// ============================================================================
// W2Inc, Amsterdam 2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { tutorial } from '$lib';
import { PUBLIC_APP_NAME } from '$env/static/public';

// ============================================================================

export type ListedUserEvent = {
	id: string;
	name: string;
	address: string;
	description: string | null;
	trackId: string | null;
	unique: boolean;
	startsAt: string;
	maxUsers?: number;
	registerUntil: string | null;
	completedAt: string | null;
	requires: string | null;
	userEventId: string | null;
};

// ============================================================================

export function useEventTutorial() {
	const none = tutorial([
		{
			popover: {
				title: 'No Events!',
				description:
					'Currently there are no events taking place that you can join. Please wait for a while and refresh this page, perhaps something may show up'
			}
		}
	]);

	const some = tutorial([
		{
			popover: {
				title: `Welcome to ${PUBLIC_APP_NAME}!`,
				description: "Let's guide you through joining an event."
			}
		},
		{
			element: '#event-action',
			popover: {
				title: 'Join Event',
				description: 'Click here to join your first event.'
			}
		},
		{
			element: '#event-when',
			popover: {
				title: 'Date & Time',
				description: 'See when the event happens. Click it to save it to your calendar.'
			}
		},
		{
			element: '#event-where',
			popover: {
				title: 'Location',
				description: 'View where the event takes place. Click it to view it on a map.'
			}
		},
		{
			popover: {
				title: "You're Ready!",
				description: 'Good luck!'
			}
		}
	]);

	return {
		drive(eventCount: number) {
			eventCount ? some.drive() : none.drive();
		}
	};
}
