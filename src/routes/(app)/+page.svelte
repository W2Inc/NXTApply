<script lang="ts">
	import { CheckCircle, AlertCircle, Calendar, Users, File, Activity } from '@lucide/svelte';

	// Example steps for student application
	const steps = [
		{
			title: "Boarding Registration",
			description: "Complete your boarding registration to secure your spot.",
			status: "completed",
			icon: CheckCircle
		},
		{
			title: "Piscine Selection",
			description: "Choose your preferred Piscine session.",
			status: "pending",
			icon: AlertCircle
		},
		{
			title: "Document Upload",
			description: "Upload required documents for verification.",
			status: "pending",
			icon: File
		},
		{
			title: "Orientation",
			description: "Attend the orientation event to get started.",
			status: "upcoming",
			icon: Calendar
		}
	];

	const statusColors = {
		completed: "text-green-500",
		pending: "text-amber-500",
		upcoming: "text-blue-500"
	};

	// Example events
	const events = [
		{
			id: 1,
			title: "Piscine Kickoff",
			date: "Jul 10, 9:00 AM",
			location: "Main Hall"
		},
		{
			id: 2,
			title: "Orientation",
			date: "Jul 15, 2:00 PM",
			location: "Auditorium"
		}
	];
</script>

<div class="space-y-8 pt-4">
	<!-- Welcome Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Welcome to NXTApply!</h1>
		<p class="text-muted-foreground mt-2">Your student application journey starts here. Follow the steps below to complete your application.</p>
	</div>

	<!-- Application Steps -->
	<div class="bg-card p-6 rounded-lg shadow-sm border border-border">
		<h2 class="text-lg font-semibold mb-4">Your Next Steps</h2>
		<ol class="space-y-5">
			{#each steps as step}
				<li class="flex items-start gap-4">
					<div class="mt-1">
						<step.icon size={24} class={statusColors[step.status]} />
					</div>
					<div>
						<p class="font-medium">{step.title}</p>
						<p class="text-sm text-muted-foreground">{step.description}</p>
						{#if step.status === 'completed'}
							<span class="text-xs text-green-600 font-semibold">Completed</span>
						{:else if step.status === 'pending'}
							<span class="text-xs text-amber-600 font-semibold">Pending</span>
						{:else}
							<span class="text-xs text-blue-600 font-semibold">Upcoming</span>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	</div>

	<!-- Upcoming Events -->
	<div class="bg-card p-6 rounded-lg shadow-sm border border-border">
		<div class="flex items-center gap-2 mb-4">
			<Calendar size={20} class="text-primary" />
			<h2 class="text-lg font-semibold">Upcoming Events</h2>
		</div>
		<ul class="space-y-4">
			{#each events as event}
				<li class="flex items-center gap-4">
					<div class="h-10 w-10 bg-muted rounded-md flex items-center justify-center text-primary">
						<Calendar size={18} />
					</div>
					<div>
						<p class="font-medium">{event.title}</p>
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							<span>{event.date}</span>
							<span>•</span>
							<span>{event.location}</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
