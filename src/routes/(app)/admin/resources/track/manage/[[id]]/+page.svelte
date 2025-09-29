<script lang="ts">
	import { page } from '$app/state';
	import Fieldset from '$lib/components/fieldset.svelte';
	import * as Form from '$lib/components/form';
	import Track from '$lib/components/track/track.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { set as remote } from '@/remotes/track/set.remote';
	import type { PageProps } from './$types';
	import { setContext } from 'svelte';
	import { TRACK_KEY, type CombinedTrack } from '$lib/components/track/state.svelte';

	const { data }: PageProps = $props();
	setContext(TRACK_KEY, data.track);
</script>

<div class="mx-auto max-w-[50rem] py-8">
	<Form.Root {...remote} class="flex gap-2">
		<Track class="h-min" />
		<Fieldset title="Settings" class="flex h-min basis-3xs flex-col gap-1">
			<Form.Field id="track-name" class="flex-1" label="Name" errors={remote.issues?.name}>
				<Input name={remote.field('name')} value={data.track?.name} />
			</Form.Field>

			<Form.Field label="Description" id="track-name" class="flex-1" errors={remote.issues?.description}>
				<Textarea rows={1} name={remote.field('description')} value={data.track?.description} />
			</Form.Field>
		</Fieldset>

		<input type="hidden" name={remote.field('id')} value={data.track?.id}/>
	</Form.Root>
</div>
