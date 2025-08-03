<script lang="ts">
	import Button from '$lib/ui/button.svelte';
	import FormEntry from '$lib/ui/form/form-entry.svelte';
	import Form from '$lib/ui/form/form.svelte';
	import Fieldset from '$lib/ui/track/fieldset.svelte';
	import { Camera, Pause, Play, RefreshCcw, Save, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let photoDataUrl = $state('');
	let videoEl: HTMLVideoElement;
	let capturing = $state(false);

	let stream = $state<MediaStream | null>(null);
	async function startCamera() {
		try {
			capturing = true;
			stream = await navigator.mediaDevices.getUserMedia({ video: true });
			videoEl.srcObject = stream;
			await videoEl.play();
		} catch (e) {
			toast.error('Error accessing camera: ' + e.message);
		}
	}
	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
			stream = null;
		}
		capturing = false;
	}
	function capturePhoto() {
		const canvas = document.createElement('canvas');
		canvas.width = videoEl.videoWidth;
		canvas.height = videoEl.videoHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(videoEl, 0, 0);
		photoDataUrl = canvas.toDataURL('image/png');
		stopCamera();
	}
</script>

<div class="flex gap-2">
	<Fieldset title="Photo" class="h-min flex-0">
		{#if !capturing && !photoDataUrl}
			<Button
				onclick={startCamera}
				aria-label="Start Camera"
				variant="ghost"
				class="group relative flex size-80 items-center justify-center rounded-xl border p-0 shadow transition-all focus:outline-none"
			>
				<Camera
					class="text-primary pointer-events-none h-12 w-12 transition-transform group-hover:scale-110"
				/>
			</Button>
		{:else if capturing}
			<div
				class="group relative size-80 overflow-hidden rounded-xl border shadow transition-all hover:shadow-lg"
			>
				<video bind:this={videoEl} class="h-full w-full object-cover" autoplay playsinline>
					<track kind="captions" label="No captions" />
				</video>
				<button
					onclick={stopCamera}
					aria-label="Stop Camera"
					tabindex="0"
					class="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-none bg-black/60 opacity-80 transition-opacity hover:opacity-100 focus:outline-none"
				>
					<X class="pointer-events-none h-5 w-5 text-white" />
				</button>
				<Button onclick={capturePhoto} class="absolute bottom-4 left-1/2 -translate-x-1/2"
					>Capture</Button
				>
			</div>
		{:else if photoDataUrl}
			<div class="border-border group relative size-80 overflow-hidden rounded-xl border shadow">
				<img src={photoDataUrl} alt="Profile" class="h-full w-full object-cover" />
				<Button
					onclick={() => {
						photoDataUrl = '';
					}}
					aria-label="Retake"
					class="absolute bottom-4 left-1/2 -translate-x-1/2"
				>
					Retake
				</Button>
			</div>
		{/if}
	</Fieldset>
	<Fieldset title="Settings" class="h-min">
		<Form>
			{#snippet fields(out)}
				{@const form = out as FormOutput}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormEntry
						type="text"
						name="firstName"
						label="First Name"
						description="The user's first name"
						errors={form.errors.firstName}
						bind:value={form.firstName}
					/>
					<FormEntry
						type="text"
						name="lastName"
						label="Last Name"
						description="The user's last name"
						errors={form.errors.lastName}
						bind:value={form.lastName}
					/>
					<FormEntry
						type="email"
						name="email"
						label="Email"
						description="User's email address"
						errors={form.errors.email}
						bind:value={form.email}
					/>
					<FormEntry
						type="tel"
						name="phone"
						label="Phone"
						description="Contact phone number"
						errors={form.errors.phone}
						bind:value={form.phone}
					/>
					<FormEntry
						type="date"
						name="dob"
						label="Date of Birth"
						description="User's date of birth"
						errors={form.errors.dob}
						bind:value={form.dob}
					/>
					<FormEntry
						type="text"
						name="country"
						label="Country"
						description="Country of residence"
						errors={form.errors.country}
						bind:value={form.country}
					/>
					<FormEntry
						type="select"
						name="gender"
						label="Gender"
						description="Select gender"
						errors={form.errors.gender}
						bind:value={form.gender}
					>
						<option value="">Select...</option>
						<option value="1">Male</option>
						<option value="2">Female</option>
						<option value="3">Other</option>
					</FormEntry>

					<div class="flex items-center gap-4">
						<Button type="reset" variant="outline" class="gap-1" onclick={e => photoDataUrl = ''}>
							Reset
							<RefreshCcw size={18} />
						</Button>
						<hr class="flex-1 border" />
						<Button type="button" variant="outline" onclick={() => history.back()}>Cancel</Button>
						<Button type="submit" class="gap-1">
							<span>Create</span>
							<Save size={18} />
						</Button>
					</div>
				</div>
			{/snippet}
		</Form>
	</Fieldset>
</div>

<!-- <Fieldset title="Onboarding">
	<div class="flex flex-col gap-10 md:flex-row md:items-start md:gap-12">
		<div class="flex flex-col items-center gap-6 md:w-80">
			{#if !capturing && !photoDataUrl}
				<div
					class="bg-muted border-border group relative flex size-72 items-center justify-center rounded-xl border shadow transition-all hover:shadow-lg"
				>
					<button
						onclick={startCamera}
						aria-label="Start Camera"
						tabindex="0"
						class="absolute inset-0 flex items-center justify-center border-none bg-transparent p-0 focus:outline-none"
						style="background: none; box-shadow: none;"
					>
						<Play
							class="text-primary pointer-events-none h-12 w-12 transition-transform group-hover:scale-110"
						/>
					</button>
				</div>
			{:else if capturing}
				<div class="group relative size-72 overflow-hidden rounded-xl border shadow hover:shadow-lg transition-all">
					<video bind:this={videoEl} class="h-full w-full object-cover" autoplay playsinline>
						<track kind="captions" label="No captions" />
					</video>
					<button
						onclick={stopCamera}
						aria-label="Stop Camera"
						tabindex="0"
						class="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-none bg-black/60 opacity-80 transition-opacity hover:opacity-100 focus:outline-none"
					>
						<X class="pointer-events-none h-5 w-5 text-white" />
					</button>
					<Button onclick={capturePhoto} class="absolute bottom-4 left-1/2 -translate-x-1/2"
						>Capture</Button
					>
				</div>
			{:else if photoDataUrl}
				<div class="border-border group relative size-72 overflow-hidden rounded-xl border shadow">
					<img src={photoDataUrl} alt="Profile" class="h-full w-full object-cover" />
					<Button
						onclick={() => {
							photoDataUrl = '';
						}}
						aria-label="Retake"
						class="absolute bottom-4 left-1/2 -translate-x-1/2"
					>
						Retake
					</Button>
				</div>
			{/if}
			<div class="text-xs text-muted-foreground text-center mt-2">
				{#if !photoDataUrl}
					<span>Click the play icon to start your camera and take a photo.</span>
				{:else}
					<span>Photo captured. You can retake if needed.</span>
				{/if}
			</div>
		</div>

		<div class="flex-1 w-full max-w-xl mx-auto">

		</div>
	</div>
</Fieldset> -->
