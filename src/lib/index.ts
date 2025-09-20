import { driver, type DriveStep } from 'driver.js';

export const UserFlag = {
	IsAdmin: 1 << 2
} as const;

export const tutorial = (steps: DriveStep[]) =>
	driver({
		showProgress: true,
		animate: true,
		steps
	});

export function ICSCalendar() {
	// function toICS(startsAt: Date, name: string, description: string | null, address: string | null) {
	// 	const start = fromDate(new Date(startsAt), page.data.tz);
	// 	const end = start.add({ hours: 1 });
	// 	const ics = `
	// 		BEGIN:VCALENDAR
	// 		VERSION:2.0
	// 		BEGIN:VEVENT
	// 		SUMMARY:${name}
	// 		DTSTART:${start
	// 			.toAbsoluteString()
	// 			.replace(/[-:]/g, '')
	// 			.replace(/\.\d+Z$/, 'Z')}
	// 		DTEND:${end
	// 			.toAbsoluteString()
	// 			.replace(/[-:]/g, '')
	// 			.replace(/\.\d+Z$/, 'Z')}
	// 		${address ? `LOCATION:${address}` : ''}
	// 		DESCRIPTION:${description ?? ''}
	// 		END:VEVENT
	// 		END:VCALENDAR
	// 	`.trim();
	// 	return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
	// }
}
