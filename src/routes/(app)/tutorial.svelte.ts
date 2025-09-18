import { PUBLIC_APP_NAME } from '$env/static/public';
import { driver } from 'driver.js';

const eventTutorial = $derived(
	driver({
		showProgress: true,
		animate: true,
		steps: [
			{
				popover: {
					title: `Welcome to ${PUBLIC_APP_NAME}!`,
					description: 'In this tutorial, we will walk you through the event application process.'
				}
			},
			{
				element: '#event-action',
				popover: {
					title: 'Join an Event',
					description:
						'Click here to join the first available event and start your application journey.'
				}
			},
			{
				element: '#event-who',
				popover: {
					title: "Who's Registered?",
					description: 'See how many people have already registered for this event.'
				}
			},
			{
				element: '#event-when',
				popover: {
					title: 'Event Date & Time',
					description:
						'Check the scheduled date and time for this event. Make sure to mark your calendar!'
				}
			},
			{
				element: '#event-where',
				popover: {
					title: 'Event Location',
					description:
						'If the event is in-person, click here to view the location on the map. For digital events, this section may not appear.'
				}
			},
			{
				popover: {
					title: 'All Set!',
					description: "You're ready to get started. Good luck with your application!"
				}
			}
		]
	})
);

const noEventTutorial = $derived(
	driver({
		showProgress: true,
		animate: true,
		steps: [
			{
				popover: {
					title: 'No Events!',
					description:
						'Currently there are no events taking place that you can join. Please wait for a while and refresh this page, perhaps something may show up'
				}
			}
		]
	})
);

export function tutorial() {
	return {
		get eventTutorial() {
			return eventTutorial;
		},
		get noEventTutorial() {
			return noEventTutorial;
		}
	};
}
