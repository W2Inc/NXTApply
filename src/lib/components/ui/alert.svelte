<script lang="ts">
	import { cn } from '$lib';
	import { Icon } from 'lucide-svelte';
	interface Props {
		title: string;
		message: string;
		icon: typeof Icon;
		variant?: 'alert' | 'info';
	}

	const { icon: IconImage, title, message, variant = 'alert' }: Props = $props();
</script>

<div
	class={cn(
		'alert',
		variant === 'info'
			? 'alert-info'
			: 'alert-warning'
	)}
>
	<IconImage class={cn('h-5 w-5 flex-shrink-0')} />
	<div>
		<h3 class="font-medium text-blue">{title}</h3>
		<p class="text-sm">{message}</p>
	</div>
</div>
