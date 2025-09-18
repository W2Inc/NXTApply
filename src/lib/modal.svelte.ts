import { browser } from "$app/environment";

let current: Modal.Options | null = $state(null);
export namespace Modal {

	// ============================================================================

	export interface Base {
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
	}

	export interface Confirm extends Base {
		type: 'confirm';
		resolve: (value: boolean) => void;
	}

	export interface Alert extends Base {
		type: 'alert';
		resolve: () => void;
	}

	export type Options = Confirm | Alert;

	export function confirm(props: Omit<Confirm, 'type' | 'resolve'>) {
		return new Promise<boolean>((resolve) => {
			current = { ...props, type: 'confirm', resolve };
		});
	}

	export function alert(props: Omit<Alert, 'type' | 'resolve'>) {
		return new Promise<void>((resolve) => {
			current = { ...props, type: 'alert', resolve };
		});
	}

	export function use() {
		return {
			get current() {
				return current;
			},
			clear: () => {
				current = null;
			}
		}
	}
}