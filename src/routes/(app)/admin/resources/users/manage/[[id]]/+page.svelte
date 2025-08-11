<script lang="ts">
	import { FormKit } from '$lib/form.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import FormEntry from '$lib/components/form-entry.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import DatePicker from '$lib/components/date-picker.svelte';
	import { CalendarDate, fromDate, getLocalTimeZone, today } from '@internationalized/date';
	import { updateUser } from '../../users.remote';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { page } from '$app/state';
	import { UserFlag } from '$lib';
	import type { PageProps } from './$types';
	import { dev } from '$app/environment';

	const { data }: PageProps = $props();
	let flags = $state(data.user?.flags ?? 0);
</script>

<div class="mx-auto mt-6 max-w-3xl overflow-hidden rounded-xl border bg-card shadow-sm">
	<div class="border-b bg-muted/40 p-5">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="space-y-1">
				<h3 class="text-lg font-medium">User details</h3>
				<p class="text-xs text-muted-foreground">Basic account and profile information.</p>
			</div>
			{#if updateUser.result?.success}
				<p class="text-xs font-medium text-green-600 dark:text-green-400">Successfully updated</p>
			{/if}
		</div>
	</div>

	<form class="p-6 pb-0" {...FormKit.remote(updateUser)}>
		<input type="hidden" name="id" value={page.params.id} />

		<div class="grid gap-8">
			<section class="space-y-4">
				<h4 class="text-sm font-semibold">Account</h4>
				<div class="grid gap-4 sm:grid-cols-2">
					<FormEntry label="Email" errors={updateUser.result?.errors?.email}>
						{#snippet child(id)}
							<Input
								{id}
								name="email"
								type="email"
								placeholder="Enter email"
								value={data.user?.email}
							/>
						{/snippet}
					</FormEntry>

					<FormEntry label="Phone" errors={updateUser.result?.errors?.phone}>
						{#snippet child(id)}
							<Input
								{id}
								name="phone"
								type="tel"
								placeholder="Phone number"
								value={data.user?.phone}
							/>
						{/snippet}
					</FormEntry>

					<input type="hidden" name="flags" value={flags} />
					<FormEntry label="Attributes" errors={updateUser.result?.errors?.flags}>
						{#snippet child()}
							<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
								{#each Object.entries(UserFlag) as [key, value]}
									<div class="flex items-center gap-1">
										<Checkbox
											id={key}
											bind:checked={
												() => Boolean(flags & value),
												(v) => {
													if (v) {
														flags = (flags || 0) | value;
													} else {
														flags = (flags || 0) & ~value;
													}
													return v;
												}
											}
										/>
										<Label
											for={key}
											class="max-w-[10ch] truncate overflow-hidden text-sm overflow-ellipsis text-muted-foreground sm:max-w-[16ch]"
											style="white-space: nowrap;"
										>
											{key}
										</Label>
									</div>
								{/each}
								{#if dev}
									<span class="text-xs text-muted-foreground">Value: {flags}</span>
								{/if}
							</div>
						{/snippet}
					</FormEntry>
				</div>
			</section>

			<Separator />

			<section class="space-y-4">
				<h4 class="text-sm font-semibold">Profile</h4>
				<div class="grid gap-4 sm:grid-cols-2">
					<FormEntry label="First Name" errors={updateUser.result?.errors?.firstName}>
						{#snippet child(id)}
							<Input
								{id}
								name="firstName"
								type="text"
								placeholder="First name"
								value={data.user?.firstName}
							/>
						{/snippet}
					</FormEntry>

					<FormEntry label="Last Name" errors={updateUser.result?.errors?.lastName}>
						{#snippet child(id)}
							<Input
								{id}
								name="lastName"
								type="text"
								placeholder="Last name"
								value={data.user?.lastName}
							/>
						{/snippet}
					</FormEntry>

					<FormEntry label="Date of Birth" errors={updateUser.result?.errors?.dob}>
						{#snippet child()}
							<DatePicker
								name="dob"
								value={fromDate(new Date(data.user?.dob), getLocalTimeZone())}
								minValue={new CalendarDate(1900, 1, 1)}
								maxValue={today(getLocalTimeZone())}
							/>
						{/snippet}
					</FormEntry>

					<FormEntry label="Country" errors={updateUser.result?.errors?.country}>
						{#snippet child(id)}
							<Input
								{id}
								name="country"
								type="text"
								placeholder="Country"
								value={data.user?.country}
							/>
						{/snippet}
					</FormEntry>

					<div class="sm:col-span-2">
						<FormEntry label="Gender" errors={updateUser.result?.errors?.gender}>
							{#snippet child(id)}
								<RadioGroup.Root
									{id}
									name="gender"
									class="grid grid-cols-1 gap-3 sm:grid-cols-3"
									value={data.user?.gender?.toString()}
								>
									<div class="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
										<RadioGroup.Item value="1" id="male" />
										<Label for="male">Male</Label>
									</div>
									<div class="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
										<RadioGroup.Item value="0" id="female" />
										<Label for="female">Female</Label>
									</div>
									<div class="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
										<RadioGroup.Item value="2" id="other" />
										<Label for="other">Rather Not Say</Label>
									</div>
								</RadioGroup.Root>
							{/snippet}
						</FormEntry>
					</div>
				</div>
			</section>
		</div>

		<div
			class="sticky bottom-0 -mx-6 mt-6 border-t bg-background/70 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/50"
		>
			<div class="flex items-center justify-end gap-3">
				<Button type="submit" class="btn btn-outline">Save</Button>
			</div>
		</div>
	</form>
</div>
