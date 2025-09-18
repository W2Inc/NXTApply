<script lang="ts">
	import { Modal } from '$lib/modal.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	const dialog = Modal.use();
	function confirm() {
		dialog.current?.resolve(true);
		dialog.clear();
	}

	function cancel() {
		dialog.current?.resolve(false);
		dialog.clear();
	}
</script>

<AlertDialog.Root open={dialog.current !== null}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{dialog.current?.title}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{dialog.current?.message}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			{#if dialog.current?.type === 'confirm'}
				<AlertDialog.Cancel onclick={cancel}>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={confirm}>Continue</AlertDialog.Action>
			{:else if dialog.current?.type === 'alert'}
				<AlertDialog.Action onclick={confirm}>OK</AlertDialog.Action>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
