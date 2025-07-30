<script lang="ts">
	import { cn } from '$lib/index.svelte';
	import type { Icon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	type InputType = HTMLInputTypeAttribute | 'select' | 'textarea';

	interface CommonProps {
		id?: string;
		type?: InputType;
		name?: string;
		label?: string;
		description?: string;
		placeholder?: string;
		errors?: string[];
		class?: string;
		required?: boolean;
		children?: Snippet<[]>;
		options?: Snippet<[any]>; // for select
		icon?: typeof Icon;
		iconSize?: number | string;
		disabled?: boolean;
		value?: any;
		checked?: boolean | null;
		group?: any | null;
		// Forwards all event handlers and rest props
		[key: string]: unknown;
	}

	let {
		type = 'text',
		name,
		label,
		description,
		errors,
		class: klass,
		children,
		options,
		disabled,
		value = $bindable(),
		checked = $bindable(),
		group,
		id,
		icon: IconComponent,
		iconSize = 16,
		required,
		...rest
	}: CommonProps = $props();

	let touched = $state(false);
	let inputId = $derived(id ?? (name ? `input-${name}` : undefined));

	const inputBase =
		'w-full bg-transparent outline-none text-base font-sans placeholder:text-muted-foreground py-1 px-2';
	const inputWithIcon = 'pl-8';
	const selectBase = 'w-full bg-transparent outline-none text-base font-sans py-1 px-2';
	const wrapperBase =
		'relative flex items-center border border-input rounded-lg bg-input transition focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary px-0 h-8';
	const errorBorder =
		'border-destructive focus-within:ring-destructive focus-within:border-destructive';
	const disabledClass = 'opacity-50 pointer-events-none';
	const checkboxClass =
		'size-4 rounded border-input bg-input transition focus:ring-primary/40 focus:ring-2 focus:outline-none';
	const textareaBase =
		'w-full bg-transparent outline-none text-base font-sans placeholder:text-muted-foreground py-1 px-2 min-h-[2.5em] resize-y';

	// Handle input/blur for touched state
	function handleBlur() {
		touched = true;
	}
</script>

<div class={cn('flex flex-col gap-1', klass)}>
	{#if label && type !== 'checkbox'}
		<label for={inputId} class="text-muted-foreground -mb-1 text-xs select-none"
			>{label}{required ? '*' : ''}</label
		>
	{/if}

	{#if type === 'select'}
		<div class={cn(wrapperBase, errors?.length && errorBorder, disabled && disabledClass)}>
			<select
				id={inputId}
				{name}
				bind:value
				class={selectBase}
				{disabled}
				onblur={handleBlur}
				{required}
				{...rest}
			>
				<!-- Prefer snippet for options, fallback to children -->
				{@render children?.()}
			</select>
		</div>
	{:else if type === 'textarea'}
		<div class={cn(wrapperBase, errors?.length && errorBorder, 'h-auto', disabled && disabledClass)}>
			<textarea
				rows="4"
				id={inputId}
				{name}
				bind:value
				class={textareaBase}
				{disabled}
				onblur={handleBlur}
				{required}
				{...rest}
			></textarea>
		</div>
	{:else if type === 'range'}
		<input
			id={inputId}
			type="range"
			{name}
			bind:value
			bind:group
			{disabled}
			onblur={handleBlur}
			{required}
			{...rest}
		/>
	{:else if type === 'file'}
		<div
			class={cn(wrapperBase, errors?.length && errorBorder, disabled && disabledClass, 'h-auto')}
		>
			<label for={inputId} class="flex w-full cursor-pointer items-center gap-2 px-2 py-1">
				<input
					id={inputId}
					type="file"
					{name}
					bind:group
					{disabled}
					onblur={handleBlur}
					{required}
					{...rest}
				/>
			</label>
		</div>
	{:else if type === 'checkbox'}
		<div class="flex items-center gap-1">
			<input
				id={inputId}
				type="checkbox"
				{name}
				bind:checked
				class={checkboxClass}
				bind:group
				{disabled}
				onblur={handleBlur}
				{required}
				{...rest}
			/>
			{#if label}
				<label for={inputId} class="text-muted-foreground -mb-1 text-xs select-none">{label}</label>
			{/if}
		</div>
	{:else if type === 'radio'}
		<div class="flex items-center gap-2">
			<input
				id={inputId}
				type="radio"
				{name}
				bind:group
				class={checkboxClass}
				{disabled}
				onblur={handleBlur}
				{required}
				{...rest}
			/>
			{#if description}
				<span class="text-sm">{description}</span>
			{/if}
		</div>
	{:else}
		<!-- Normal inputs (text, email, number, etc) -->
		<div class={cn(wrapperBase, errors?.length && errorBorder, disabled && disabledClass)}>
			{#if IconComponent && type !== 'range'}
				<span
					class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 flex -translate-y-1/2 items-center"
				>
					<IconComponent size={iconSize} />
				</span>
			{/if}
			<input
				id={inputId}
				{type}
				{name}
				bind:value
				class={cn(inputBase, IconComponent && type !== 'range' && inputWithIcon)}
				{disabled}
				onblur={handleBlur}
				{required}
				{...rest}
			/>
		</div>
	{/if}

	{#if errors?.length}
		{#each errors as error}
			<span class="text-destructive animate-pulse text-xs italic">
				{error}
			</span>
		{/each}
	{:else if description}
		<div class="text-muted-foreground text-xs">{description}</div>
	{/if}
</div>

<style>
	input[type='color'] {
		appearance: none;
		background-color: transparent;
		padding: 0 !important;
		&::-webkit-color-swatch-wrapper {
			padding: 0 !important;
		}
		&::-webkit-color-swatch {
			border: 1px solid transparent;
			border-radius: 4px;
		}
	}
	input[type='file']::file-selector-button {
		border: 1.5px solid var(--primary);
		padding: 0.01em 0.9em;
		border-radius: 0.3rem;
		background: var(--primary);
		color: var(--primary-foreground);
		font-size: 0.8em;
		cursor: pointer;
	}
</style>
