<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		ShieldUser,
		Download,
		Trash2,
		Lock,
		Eye,
		Database,
		User,
		MapPin,
		ActivitySquare
	} from '@lucide/svelte';
</script>

<div class="container mx-auto max-w-3xl">
	<section class="py-12">
		<div class="mb-12 text-center">
			<h1 class="mb-6 flex items-center justify-center gap-3 text-4xl font-bold">
				<ShieldUser class="h-10 w-10 text-primary" /> GDPR & Data Privacy
			</h1>
			<p class="mx-auto max-w-3xl text-xl text-muted-foreground">
				Your privacy is our priority. We're committed to transparency and giving you full control
				over your personal data in accordance with GDPR regulations.
			</p>
		</div>

		<div class="mb-12 grid gap-8 lg:grid-cols-2">
			<div class="rounded-lg border bg-card p-8 shadow">
				<div class="mb-4 flex items-center gap-3">
					<Database class="h-6 w-6 text-primary" />
					<h2 class="text-2xl font-semibold">What Data We Collect</h2>
				</div>
				<div class="space-y-4">
					<p class="mb-4 text-muted-foreground">
						We only collect data that's necessary to provide our services and enhance your
						experience:
					</p>
					<ul class="space-y-1 text-sm">
						<li class="flex items-start gap-3">
							<ShieldUser class="mt-1 h-5 w-5 text-primary" />
							<div>
								<strong class="font-medium">Contact Information:</strong>
								<span class="text-muted-foreground">Email address, phone number</span>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<User class="mt-1 h-5 w-5 text-primary" />
							<div>
								<strong class="font-medium">Personal Details:</strong>
								<span class="text-muted-foreground">First name, last name, age</span>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<MapPin class="mt-1 h-5 w-5 text-primary" />
							<div>
								<strong class="font-medium">Address Information:</strong>
								<span class="text-muted-foreground">Mailing and billing addresses</span>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<ActivitySquare class="mt-1 h-5 w-5 text-primary" />
							<div>
								<strong class="font-medium">Activity Data:</strong>
								<span class="text-muted-foreground"
									>Events participated in, dates, and preferences</span
								>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div class="rounded-lg border bg-card p-8 shadow">
				<div class="mb-4 flex items-center gap-3">
					<Eye class="h-6 w-6 text-primary" />
					<h2 class="text-2xl font-semibold">Privacy-First Analytics</h2>
				</div>
				<p class="mb-4 text-muted-foreground">
					We use <a
						href="https://plausible.io/"
						target="_blank"
						rel="noopener"
						class="font-medium text-primary hover:underline">Plausible Analytics</a
					>
					to understand how our site is used and improve your experience.
					<strong>Privacy guarantee:</strong>
					Plausible <span class="font-medium text-green-600">does not</span> collect cookies, personal
					data, or any information that could identify you. It's 100% GDPR compliant.
				</p>
			</div>
		</div>

		<div class="mb-8 rounded-lg border bg-card p-8 shadow">
			<div class="mb-6 flex items-center gap-3">
				<Lock class="h-6 w-6 text-primary" />
				<h2 class="text-2xl font-semibold">Your Rights Under GDPR</h2>
			</div>
			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<h3 class="mb-2 text-lg font-semibold">Right to Access</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						You can request a complete copy of all personal data we hold about you, including how
						it's used and who it's shared with.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-semibold">Right to Deletion</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						You can request complete deletion of your account and all associated personal data from
						our systems.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-semibold">Right to Rectification</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						You can request corrections to any inaccurate or incomplete personal data we hold about
						you.
					</p>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-semibold">Right to Portability</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						You can request your data in a structured, machine-readable format to transfer to
						another service.
					</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border bg-gradient-to-r from-primary/5 to-accent/5 p-8">
			<h2 class="mb-4 text-center text-2xl font-semibold">Exercise Your Data Rights</h2>
			<p class="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">
				Enter your email address below to make a data request. We'll process your request within 30
				days and send the results to your registered email address.
			</p>

			<div class="mx-auto max-w-md space-y-6">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Button type="button" href="/gdpr" download class="flex w-full items-center gap-2">
						<Download class="h-4 w-4" />
						Request My Data
					</Button>
					<Button
						type="button"
						onclick={() => fetch('/gdpr', { method: 'DELETE' })}
						variant="destructive"
						class="flex w-full items-center gap-2"
					>
						<Trash2 class="h-4 w-4" />
						Delete My Account
					</Button>
				</div>
			</div>

			<div class="mt-6 text-center text-sm text-muted-foreground">
				<p>
					For questions about data processing or to exercise additional rights, contact us at <a
						href="mailto:privacy@example.com"
						class="text-primary hover:underline">privacy@example.com</a
					>
				</p>
			</div>
		</div>
	</section>
</div>
