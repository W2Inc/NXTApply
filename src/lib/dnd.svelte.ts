/**
 * Composable to handle drag and drop reordering of arrays.
 *
 * @param initial The initial array value
 */
export function useDragAndDrop<T>(initial: T[]) {
	let items = $state(initial);
	let isDragActive = $state(false);
	let draggedIndex = $state<number | null>(null);

	function draggable(index: number) {
		return {
			draggable: true,
			ondragstart: (ev: DragEvent) => {
				draggedIndex = index;
				isDragActive = true;
				ev.dataTransfer!.effectAllowed = 'move';
				ev.dataTransfer?.setData('text/plain', index.toString());
			},
			ondragover: (ev: DragEvent) => {
				ev.preventDefault();
				if (draggedIndex !== index) {
					(ev.currentTarget as HTMLElement).classList.add('over');
				}
				ev.stopPropagation();
			},
			ondragleave: (ev: DragEvent) => {
				ev.preventDefault();
				(ev.currentTarget as HTMLElement).classList.remove('over');
				ev.stopPropagation();
			},
			ondrop: (ev: DragEvent) => {
				ev.preventDefault();
				(ev.currentTarget as HTMLElement).classList.remove('over');

				if (draggedIndex !== null && draggedIndex !== index) {
					const draggedItem = items.splice(draggedIndex, 1)[0];
					items = items.toSpliced(index, 0, draggedItem!);
				}

				isDragActive = false;
				draggedIndex = null;
			}
		};
	}

	return {
		draggable,
		isDragActive,
		draggedIndex,
		get items() { return items; },
		set items(value) { items = value; }
	};
}
