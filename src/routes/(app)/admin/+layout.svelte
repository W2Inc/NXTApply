<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

{@render children?.()}
