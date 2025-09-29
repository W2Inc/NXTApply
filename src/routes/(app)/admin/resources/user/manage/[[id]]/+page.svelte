<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Form from '$lib/components/form';
	import { set } from '@/remotes/user/set.remote';
	import type { PageProps } from './$types';
	import Datepicker from '$lib/components/datepicker.svelte';
	import { FormKit } from "$lib/runes/form.svelte";

	const { data }: PageProps = $props();
	const form = FormKit.handle(set);

	function goBack() {
		history.back();
	}
</script>

<Card.Root class="max-w-lg mx-auto">
	<Card.Header>
		<Card.Title>Edit User Profile</Card.Title>
		<Card.Description>Update user information</Card.Description>
	</Card.Header>
	<Card.Content>
		<Form.Root {...set}>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-4">
					<Form.Field id="email" label="Email" errors={set.issues?.email}>
						<Input
							id="email"
							name={set.field('email')}
							type="email"
							required
							value={data.user?.email || ''}
							placeholder="user@example.com"
						/>
					</Form.Field>

					<Form.Field id="firstName" label="First Name" errors={set.issues?.firstName}>
						<Input
							id="firstName"
							name={set.field('firstName')}
							type="text"
							value={data.user?.firstName || ''}
							placeholder="First Name"
						/>
					</Form.Field>

					<Form.Field id="lastName" label="Last Name" errors={set.issues?.lastName}>
						<Input
							id="lastName"
							name={set.field('lastName')}
							type="text"
							value={data.user?.lastName || ''}
							placeholder="Last Name"
						/>
					</Form.Field>

					<Form.Field id="phone" label="Phone Number" errors={set.issues?.phone}>
						<Input
							id="phone"
							name={set.field('phone')}
							type="tel"
							value={data.user?.phone || ''}
							placeholder="+1 (555) 123-4567"
						/>
					</Form.Field>
				</div>

				<div class="space-y-4">
					<Form.Field id="dob" label="Date of Birth" errors={set.issues?.dob}>
						<Datepicker format="date" name={set.field('dob')}/>
						<!-- <Input
							id="dob"
							name={set.field('dob')}
							type="date"
							value={data.user?.dob ? new Date(user.dob).toISOString().substring(0, 10) : ''}
						/> -->
					</Form.Field>

					<Form.Field id="gender" label="Gender" errors={set.issues?.gender}>
						<select
							id="gender"
							name={set.field('gender')}
							class="w-full p-2 rounded border border-input bg-background"
							value={data.user?.gender || ''}
						>
							<option value="">Select Gender</option>
							<option value="0">Male</option>
							<option value="1">Female</option>
							<option value="2">Other</option>
							<option value="3">Prefer not to say</option>
						</select>
					</Form.Field>

					<Form.Field id="country" label="Country" errors={set.issues?.country}>
						<Input
							id="country"
							name={set.field('country')}
							type="text"
							value={data.user?.country || ''}
							placeholder="Country"
						/>
					</Form.Field>

					{#if data.user?.provider}
						<div class="border p-3 rounded bg-muted/20">
							<p class="text-sm font-medium">OAuth Provider</p>
							<p class="text-xs text-muted-foreground">{user.provider} ({user.providerId})</p>
						</div>
					{/if}
				</div>
			</div>

			<div class="flex justify-between mt-6">
				<Button variant="outline" type="button" onclick={goBack}>Cancel</Button>
				<Button type="submit">Save Changes</Button>
			</div>
		</Form.Root>
	</Card.Content>
</Card.Root>
