<script>
	import { Users, Calendar, UserPlus, BarChart3, ArrowRight } from '@lucide/svelte';
	import { onMount } from 'svelte';

	// Placeholder data for charts - in a real app, you'd fetch this from an API
	let activeUsers = $state(0);
	let totalUsers = $state(0);

	// Simulate data loading
	onMount(async () => {
		activeUsers = 142;
		totalUsers = 1258;
	});
</script>

<div class="container py-8 mx-auto">
	<header class="mb-8">
		<h1 class="text-3xl font-bold">Admin Dashboard</h1>
		<p class="text-muted-foreground">Manage your events and users</p>
	</header>

	<section class="mb-10">
		<h2 class="text-xl font-semibold mb-4">Quick Access</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<!-- Event Creation Card -->
			<a href="/admin/resources/event/manage" class="group flex flex-col p-6 bg-card rounded-lg shadow hover:shadow-md transition-all border">
				<div class="flex items-start justify-between">
					<div class="p-2 bg-primary/10 rounded-full">
						<Calendar class="w-6 h-6 text-primary" />
					</div>
					<ArrowRight class="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
				</div>
				<h3 class="text-lg font-medium mt-4">Create Event</h3>
				<p class="text-muted-foreground text-sm mt-1">Schedule and manage new events</p>
			</a>

			<!-- User Onboarding Card -->
			<a href="/admin/resources/user/boarding" class="group flex flex-col p-6 bg-card rounded-lg shadow hover:shadow-md transition-all border">
				<div class="flex items-start justify-between">
					<div class="p-2 bg-primary/10 rounded-full">
						<UserPlus class="w-6 h-6 text-primary" />
					</div>
					<ArrowRight class="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
				</div>
				<h3 class="text-lg font-medium mt-4">Onboard User</h3>
				<p class="text-muted-foreground text-sm mt-1">Manage user onboarding process</p>
			</a>

			<!-- Analytics Card -->
			<a href="/admin/analytics" class="group flex flex-col p-6 bg-card rounded-lg shadow hover:shadow-md transition-all border">
				<div class="flex items-start justify-between">
					<div class="p-2 bg-primary/10 rounded-full">
						<BarChart3 class="w-6 h-6 text-primary" />
					</div>
					<ArrowRight class="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
				</div>
				<h3 class="text-lg font-medium mt-4">Analytics</h3>
				<p class="text-muted-foreground text-sm mt-1">View detailed user and event statistics</p>
			</a>
		</div>
	</section>

	<section>
		<h2 class="text-xl font-semibold mb-4">Overview</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Active Users Chart -->
			<div class="p-6 bg-card rounded-lg shadow border">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-medium">Active Users</h3>
					<div class="p-2 bg-chart-1/10 rounded-full">
						<Users class="w-5 h-5 text-chart-1" />
					</div>
				</div>
				<div class="h-[200px] flex items-center justify-center bg-secondary/20 rounded-md">
					<!-- Chart would go here - using placeholder for now -->
					<div class="text-center">
						<p class="text-4xl font-bold text-chart-1">{activeUsers}</p>
						<p class="text-muted-foreground text-sm">Currently active users</p>
					</div>
				</div>
			</div>

			<!-- Total Users Chart -->
			<div class="p-6 bg-card rounded-lg shadow border">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-medium">Registered Users</h3>
					<div class="p-2 bg-chart-2/10 rounded-full">
						<Users class="w-5 h-5 text-chart-2" />
					</div>
				</div>
				<div class="h-[200px] flex items-center justify-center bg-secondary/20 rounded-md">
					<!-- Chart would go here - using placeholder for now -->
					<div class="text-center">
						<p class="text-4xl font-bold text-chart-2">{totalUsers}</p>
						<p class="text-muted-foreground text-sm">Total registered users</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
