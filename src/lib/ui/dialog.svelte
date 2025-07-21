<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	interface Props extends HTMLDialogAttributes {
		actions?: Snippet<[]>;
		children?: Snippet<[]>;
		onClose?: (value?: string) => void;
	}

	const { children, actions, onClose, ...rest }: Props = $props();
	let dialog: HTMLDialogElement;
	let returnValue = $state('');

	function showModal() {
		dialog?.showModal();
	}

	function handleClose(event: Event) {
		const dialogEl = event.target as HTMLDialogElement;
		returnValue = dialogEl.returnValue;
		onClose?.(returnValue);
	}

	function handleConfirm(event: Event) {
		event.preventDefault();
		const form = (event.target as HTMLElement).closest('form');
		const select = form?.querySelector('select');
		dialog?.close(select?.value);
	}
</script>

<dialog
	open
	bind:this={dialog}
	onclose={handleClose}
	class="absolute bg-card text-card-foreground mx-auto max-w-md rounded-lg p-6 shadow-lg"
	{...rest}
>
	<!-- Body -->
	<div class="mb-4">
		{#if children}
			{@render children?.()}
		{:else}
			<p class="text-sm">Greetings, one and all!</p>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex justify-end gap-2">
		{#if actions}
			{@render actions?.()}
		{:else}
			<form method="dialog" class="flex gap-2">
				<button autofocus value="cancel" formmethod="dialog">Cancel</button>
				<button id="confirmBtn" value="default" onclick={handleConfirm}>Confirm</button>
			</form>
		{/if}
	</div>
</dialog>
