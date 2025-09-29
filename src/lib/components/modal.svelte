<script lang="ts">
	import { Modal } from '$lib/modal.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { tick } from 'svelte';

	const dialog = Modal.use();
	function confirm() {
		dialog.current?.resolve(true);
		tick().then(() => dialog.clear())
	}

	function cancel() {
		dialog.current?.resolve(false);
		tick().then(() => dialog.clear())
	}
</script>

<!-- {#if dialog.current} -->
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
<!-- {/if} -->
