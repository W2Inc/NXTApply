// ============================================================================
// W2Inc, Amsterdam 2023-2025, All Rights Reserved.
// See README in the root project for more information.
// ============================================================================

import { CronJob } from 'cron';
import { DATABASE_URL } from '$env/static/private';
import { logger } from '$lib/logger';

// ============================================================================

namespace Jobs {
	/**
	 * Thin wrapper to create a worker for a specific job.
	 * This allows for better organization and management of worker threads.
	 * @param name - The name of the job to be executed by the worker.
	 * @param smol - Use less memory, but make the worker slower.
	 * @returns
	 */
	export function create(name: string, smol: boolean = true) {
		const worker = new Worker(new URL(`./${name}.ts`, import.meta.url), {
			name,
			smol,
			type: 'module',
			env: {
				DATABASE_URL: DATABASE_URL
			}
		});

		logger.info(`[Worker] '${name}' started`);
		worker.onmessage = (event) => {
			if ('message' in event.data) {
				return logger.info(`[Worker] '${name}' message: ${event.data.message}`);
			}
			logger.info(event.data, `[Worker] '${name}' message:`);
		};

		worker.onerror = (error) => {
			logger.error(`[Worker] '${name}' error:`, error.message);
		};

		worker.onmessageerror = (error) => {
			logger.error(`[Worker] '${name}' message error:`, error);
		};

		return worker;
	}

	/**
	 * Wrap create around a scheduled CronJob.
	 * @param cronTime The Cron timing to run the job
	 * @param names Array of job names (should match file names, e.g: ['metric', 'session-cleanup'])
	 * @returns
	 */
	export function schedule(cronTime: string | Date, names: string[]) {
		return new CronJob(cronTime, () => {
			for (const name of names) {
				create(name);
			}
		});
	}
}

// ============================================================================

export const current = [
	Jobs.schedule('0 0 1,15 * *', ['metric']), // Every half a month (1st and 15th)
	Jobs.schedule('*/15 * * * *', ['session-cleanup']) // Every 15 minutes
];

export default Jobs;
