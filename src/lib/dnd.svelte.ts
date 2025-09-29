// ============================================================================
// Anaglyphic, Netherlands @ 2024.
// See README in the root project for more information.
// ============================================================================

import { tick } from 'svelte';

/**
 * Composable to handle drag and drop on simple arrays.
 *
 * @note Naturally this composable doesn't apply any sort of styling on the
 * dragged elements themselves (except the drag image). It is expected that
 * draggable items have a `.over` class defined for how they visually should
 * look when being dragged over them.
 *
 * @param initial The initial starting value.
 * @param styling The styling to apply when over
 */
export function useDragAndDrop<T>(initial: T[]) {
	let items = $state(initial); // TODO: Should probably be .raw but look at it
	let isDragActive = $state<boolean>(false);
	let draggedIndex = $state<number | null>(null);

	// Creates a draggable element props object for the given index
	function draggable(index: number) {
		return {
			draggable: true,
			ondragstart: (ev: DragEvent) => dragstartHandle(ev, index),
			ondragover: (ev: DragEvent) => dragoverHandle(ev, index),
			ondragleave: dragleaveHandle,
			ondrop: (ev: DragEvent) => dragdropHandle(ev, index),
			class: isDragActive && draggedIndex !== index ? 'svelte-dnd-touch-feedback' : ''
		};
	}

	// Start dragging and set up drag image
	function dragstartHandle(ev: DragEvent, id: number) {
		draggedIndex = id;
		isDragActive = true;
		ev.dataTransfer?.setData('text/plain', id.toString());
		ev.dataTransfer!.effectAllowed = 'move';

		const node = ev.currentTarget as HTMLElement;
		const nodeRect = node.getBoundingClientRect();
		const offsetX = ev.clientX - nodeRect.left;
		const offsetY = ev.clientY - nodeRect.top;

		// You might think this is a hack, well actually this is how you're supposed to do it!
		// In order to set the image the DOM needs to render the cloned / clipped element
		// so that it can take a picture of it. It's hacky but it's the only legitimate way.
		// const dragImage = node.cloneNode(true) as HTMLElement;
		// dragImage.style.position = 'absolute';
		// dragImage.style.top = '-9999px';
		// dragImage.style.width = '10rem';
		// dragImage.style.borderRadius = '8px';
		// document.body.appendChild(dragImage);
		// ev.dataTransfer?.setDragImage(dragImage, offsetX, offsetY);

		// tick().then(() => document.body.removeChild(dragImage));
		// setTimeout(() => document.body.removeChild(dragImage), 0);
	}

	// Handle dragging over an item
	function dragoverHandle(ev: DragEvent, targetIndex: number) {
		ev.preventDefault();
		const target = ev.currentTarget as HTMLElement;
		if (draggedIndex !== targetIndex) {
			target.classList.add('over');
		}
		ev.stopPropagation();
	}

	// Remove hover class when leaving an item
	function dragleaveHandle(ev: DragEvent) {
		ev.preventDefault();
		const target = ev.currentTarget as HTMLElement;
		target.classList.remove('over');
		ev.stopPropagation();
	}

	// Handle drop and reordering
	function dragdropHandle(ev: DragEvent, targetIndex: number) {
		dragleaveHandle(ev);

		// We must use the draggedIndex state here, not the dataTransfer value
		// as we're managing the state in our component
		if (draggedIndex !== null && draggedIndex !== targetIndex) {
			const draggedItem = items.splice(draggedIndex, 1)[0];
			if (draggedItem !== undefined) {
				items = items.toSpliced(targetIndex, 0, draggedItem);
			}
		}

		// Reset the drag state
		isDragActive = false;
		draggedIndex = null;
	}

	return {
		draggable,
		isDragActive,
		draggedIndex,
		get items() {
			return items;
		},
		set items(value) {
			items = value;
		}
	};
}
