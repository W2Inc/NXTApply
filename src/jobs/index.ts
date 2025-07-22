import { DATABASE_URL } from '$env/static/private';

/**
 * Thin wrapper to create a worker for a specific job.
 * This allows for better organization and management of worker threads.
 * @param name - The name of the job to be executed by the worker.
 * @param smol - Use less memory, but make the worker slower.
 * @returns
 */
export function worker(name: string) {
	const worker = new Worker(new URL(`./${name}.ts`, import.meta.url), {
		name,
		smol: true,
		type: 'module',
		env: {
			DATABASE_URL: DATABASE_URL
		},
	});

	console.log(`[Worker] ${name} started`);

	worker.onmessage = (event) => {
		console.log(`[Worker]: ${name} message:`, event.data);
	};

	worker.onerror = (error) => {
		console.error(`[Worker] ${name} error:`, error);
	};

	worker.onmessageerror = (error) => {
		console.error(`[Worker] ${name} message error:`, error);
	};

	return worker;
}