import Table from "./table.svelte";

export interface ColumnDef<T> {
	key: keyof T;
	label: string;
	/**
	 * @bool - Display as boolean
	 * @date - Display as a date
	 * @years - Display date as in how many years
	 */
	type?: 'bool' | 'date' | 'years';
}

export default Table;
