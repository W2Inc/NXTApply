import pino from 'pino';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { dev } from '$app/environment';

const file = join(tmpdir(), `pino-${process.pid}-example`);
const transport = pino.transport({
	targets: [
		{
			target: 'pino-pretty',
			options: {
				destination: !dev && file,
				colorize: true
			}
		}
	]
});

export const logger = pino(transport);
