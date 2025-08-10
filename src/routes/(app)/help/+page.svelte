<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		HelpCircle,
		Send,
		MessageSquare,
		Book,
		Settings,
		CreditCard,
		UserCheck,
		Shield
	} from '@lucide/svelte';

	let formData = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};

	function handleSubmit(event: Event) {
		event.preventDefault();
		// Handle form submission
		console.log('Form submitted:', formData);
	}
</script>

<div class="container mx-auto max-w-3xl">
	<section class="py-12">
		<div class="mb-12 text-center">
			<h1 class="mb-6 flex items-center justify-center gap-3 text-4xl font-bold">
				<HelpCircle class="h-10 w-10 text-primary" /> Help & Support
			</h1>
			<p class="mx-auto max-w-3xl text-xl text-muted-foreground">
				Find answers to common questions and get the support you need. If you can't find what you're
				looking for, reach out to us directly.
			</p>
		</div>

		<div class="mb-12 space-y-6">
			<details class="group rounded-lg border bg-card shadow">
				<summary
					class="flex cursor-pointer items-center gap-3 p-6 font-semibold transition-colors hover:bg-muted"
				>
					<UserCheck class="h-5 w-5 text-primary" />
					Getting Started
					<div class="ml-auto transform transition-transform group-open:rotate-180">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
				</summary>
				<div class="border-t px-6 pt-4 pb-6">
					<div class="space-y-4">
						<div>
							<h4 class="mb-2 font-medium">How do I create an account?</h4>
							<p class="text-sm text-muted-foreground">
								Click the "Sign Up" button in the top right corner and fill out the registration
								form with your details.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">How do I reset my password?</h4>
							<p class="text-sm text-muted-foreground">
								On the login page, click "Forgot Password" and enter your email address. We'll send
								you a reset link.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">Can I change my email address?</h4>
							<p class="text-sm text-muted-foreground">
								Yes, you can update your email address in your account settings under the "Profile"
								section.
							</p>
						</div>
					</div>
				</div>
			</details>

			<details class="group rounded-lg border bg-card shadow">
				<summary
					class="flex cursor-pointer items-center gap-3 p-6 font-semibold transition-colors hover:bg-muted"
				>
					<Book class="h-5 w-5 text-primary" />
					Events & Bookings
					<div class="ml-auto transform transition-transform group-open:rotate-180">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
				</summary>
				<div class="border-t px-6 pt-4 pb-6">
					<div class="space-y-4">
						<div>
							<h4 class="mb-2 font-medium">How do I book an event?</h4>
							<p class="text-sm text-muted-foreground">
								Browse available events, select your preferred date and time, then follow the
								booking process to secure your spot.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">Can I cancel my booking?</h4>
							<p class="text-sm text-muted-foreground">
								Yes, you can cancel bookings up to 24 hours before the event start time through your
								account dashboard.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">What happens if an event is cancelled?</h4>
							<p class="text-sm text-muted-foreground">
								We'll notify you immediately via email and offer a full refund or credit for future
								events.
							</p>
						</div>
					</div>
				</div>
			</details>

			<details class="group rounded-lg border bg-card shadow">
				<summary
					class="flex cursor-pointer items-center gap-3 p-6 font-semibold transition-colors hover:bg-muted"
				>
					<CreditCard class="h-5 w-5 text-primary" />
					Payments & Billing
					<div class="ml-auto transform transition-transform group-open:rotate-180">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
				</summary>
				<div class="border-t px-6 pt-4 pb-6">
					<div class="space-y-4">
						<div>
							<h4 class="mb-2 font-medium">What payment methods do you accept?</h4>
							<p class="text-sm text-muted-foreground">
								We accept all major credit cards, debit cards, and digital payment methods including
								PayPal and Apple Pay.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">How do refunds work?</h4>
							<p class="text-sm text-muted-foreground">
								Refunds are processed within 5-7 business days to your original payment method,
								depending on your bank.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">Can I get an invoice for my purchase?</h4>
							<p class="text-sm text-muted-foreground">
								Yes, invoices are automatically generated and sent to your email after each
								purchase. You can also download them from your account.
							</p>
						</div>
					</div>
				</div>
			</details>

			<details class="group rounded-lg border bg-card shadow">
				<summary
					class="flex cursor-pointer items-center gap-3 p-6 font-semibold transition-colors hover:bg-muted"
				>
					<Settings class="h-5 w-5 text-primary" />
					Account Settings
					<div class="ml-auto transform transition-transform group-open:rotate-180">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
				</summary>
				<div class="border-t px-6 pt-4 pb-6">
					<div class="space-y-4">
						<div>
							<h4 class="mb-2 font-medium">How do I update my profile information?</h4>
							<p class="text-sm text-muted-foreground">
								Go to your account settings and click on "Edit Profile" to update your personal
								information, contact details, and preferences.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">How do I manage my notification preferences?</h4>
							<p class="text-sm text-muted-foreground">
								In your account settings, navigate to "Notifications" to customize which emails and
								alerts you receive.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">How do I delete my account?</h4>
							<p class="text-sm text-muted-foreground">
								Contact our support team or visit the GDPR page to request account deletion. This
								action is permanent and cannot be undone.
							</p>
						</div>
					</div>
				</div>
			</details>

			<details class="group rounded-lg border bg-card shadow">
				<summary
					class="flex cursor-pointer items-center gap-3 p-6 font-semibold transition-colors hover:bg-muted"
				>
					<Shield class="h-5 w-5 text-primary" />
					Privacy & Security
					<div class="ml-auto transform transition-transform group-open:rotate-180">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
				</summary>
				<div class="border-t px-6 pt-4 pb-6">
					<div class="space-y-4">
						<div>
							<h4 class="mb-2 font-medium">Is my personal data secure?</h4>
							<p class="text-sm text-muted-foreground">
								Yes, we use industry-standard encryption and security measures to protect your data.
								Visit our GDPR page for more details.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">Do you share my data with third parties?</h4>
							<p class="text-sm text-muted-foreground">
								We only share data when necessary to provide our services and never sell your
								personal information. See our privacy policy for details.
							</p>
						</div>
						<div>
							<h4 class="mb-2 font-medium">How can I exercise my GDPR rights?</h4>
							<p class="text-sm text-muted-foreground">
								Visit our GDPR page to request your data, make corrections, or delete your account
								in compliance with data protection regulations.
							</p>
						</div>
					</div>
				</div>
			</details>
		</div>

		<div class="rounded-lg border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
			<div class="mb-6 text-center">
				<MessageSquare class="mx-auto mb-4 h-12 w-12 text-primary" />
				<h2 class="mb-2 text-2xl font-semibold">Still Need Help?</h2>
				<p class="text-muted-foreground">
					Can't find the answer you're looking for? Send us a message and we'll get back to you as
					soon as possible.
				</p>
			</div>

			<form class="mx-auto max-w-2xl space-y-6" on:submit={handleSubmit}>
				<div>
					<label for="subject" class="mb-2 block text-sm font-medium">Subject</label>
					<input
						type="text"
						id="subject"
						bind:value={formData.subject}
						required
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
						placeholder="What's this about?"
					/>
				</div>

				<div>
					<label for="message" class="mb-2 block text-sm font-medium">Message</label>
					<textarea
						id="message"
						bind:value={formData.message}
						required
						rows="6"
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
						placeholder="Please describe your question or issue in detail..."
					></textarea>
				</div>

				<Button type="submit" class="flex w-full items-center justify-center gap-2">
					<Send class="h-4 w-4" />
					Send Message
				</Button>
			</form>

			<div class="mt-6 text-center text-sm text-muted-foreground">
				<p>
					You can also reach us directly at <a
						href="mailto:support@example.com"
						class="text-primary hover:underline">support@example.com</a
					>
				</p>
			</div>
		</div>
	</section>
</div>
