<script lang="ts">
  import {
    TrendingUp,
    TrendingDown,
    Users,
    Box,
    DollarSign,
    Clock,
    Calendar,
    MoreVertical,
    CheckCircle,
    XCircle,
    AlertCircle,
    Activity,

		File,

		BarChart3,

		Settings



  } from '@lucide/svelte';
	import type { PageProps } from './$types';

  // Sample dashboard data
  const stats = [
    {
      title: "Total Users",
      value: "4,893",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-chart-1"
    },
    {
      title: "Revenue",
      value: "$21,345",
      change: "+6.8%",
      trend: "up",
      icon: DollarSign,
      color: "text-chart-2"
    },
    {
      title: "Active Sessions",
      value: "584",
      change: "-2.3%",
      trend: "down",
      icon: Activity,
      color: "text-chart-3"
    },
    {
      title: "Completed Tasks",
      value: "943",
      change: "+8.2%",
      trend: "up",
      icon: CheckCircle,
      color: "text-chart-5"
    }
  ];

  // Recent activities
  const activities = [
    {
      id: 1,
      user: "Emma Thompson",
      action: "Created a new account",
      status: "success",
      time: "10 minutes ago"
    },
    {
      id: 2,
      user: "Liam Wilson",
      action: "Submitted an application",
      status: "pending",
      time: "25 minutes ago"
    },
    {
      id: 3,
      user: "Sophia Chen",
      action: "Made a payment",
      status: "success",
      time: "1 hour ago"
    },
    {
      id: 4,
      user: "Noah Garcia",
      action: "Failed login attempt",
      status: "error",
      time: "2 hours ago"
    },
    {
      id: 5,
      user: "Olivia Brown",
      action: "Updated profile information",
      status: "success",
      time: "3 hours ago"
    }
  ];

  // Upcoming events
  const events = [
    {
      id: 1,
      title: "Team Meeting",
      date: "Today, 2:00 PM",
      participants: 8
    },
    {
      id: 2,
      title: "Project Review",
      date: "Tomorrow, 10:30 AM",
      participants: 5
    },
    {
      id: 3,
      title: "Quarterly Planning",
      date: "Jul 18, 9:00 AM",
      participants: 12
    }
  ];

  // Status values and colors
  const statusColors = {
    success: "text-green-500",
    pending: "text-amber-500",
    error: "text-red-500"
  };

  const statusIcons = {
    success: CheckCircle,
    pending: AlertCircle,
    error: XCircle
  };

	const {data}: PageProps = $props();
</script>

<div class="space-y-6">
	{JSON.stringify(data, null, 2)}
  <!-- Page Header -->
  <div>
    <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
    <p class="text-muted-foreground mt-1">Welcome back, W2Wizard! Here's what's happening.</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each stats as stat}
      <div class="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-muted-foreground">{stat.title}</p>
            <h3 class="text-2xl font-semibold mt-1">{stat.value}</h3>
          </div>
          <div class="h-9 w-9 rounded-full bg-muted flex items-center justify-center {stat.color}">
            <svelte:component this={stat.icon} size={18} />
          </div>
        </div>
        <div class="mt-3 flex items-center text-xs">
          {#if stat.trend === 'up'}
            <TrendingUp size={14} class="text-green-500 mr-1" />
            <span class="text-green-500">{stat.change}</span>
          {:else}
            <TrendingDown size={14} class="text-red-500 mr-1" />
            <span class="text-red-500">{stat.change}</span>
          {/if}
          <span class="text-muted-foreground ml-2">since last month</span>
        </div>
      </div>
    {/each}
  </div>

  <!-- Main Content Area -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Recent Activity -->
    <div class="bg-card text-card-foreground p-5 rounded-lg shadow-sm border border-border lg:col-span-2">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Recent Activity</h2>
        <button class="text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      <div class="space-y-4">
        {#each activities as activity}
          <div class="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
            <div class="{statusColors[activity.status]} mt-0.5">
              <svelte:component this={statusIcons[activity.status]} size={16} />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="text-sm font-medium">{activity.user}</p>
                <span class="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p class="text-sm text-muted-foreground">{activity.action}</p>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-4">
        <button class="text-sm text-primary hover:text-primary/80 transition-colors">
          View all activity
        </button>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="bg-card text-card-foreground p-5 rounded-lg shadow-sm border border-border">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Upcoming Events</h2>
        <button class="text-muted-foreground hover:text-foreground transition-colors">
          <Calendar size={18} />
        </button>
      </div>

      <div class="space-y-4">
        {#each events as event}
          <div class="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
            <div class="h-10 w-10 bg-muted rounded-md flex items-center justify-center text-primary">
              <Calendar size={18} />
            </div>
            <div>
              <p class="text-sm font-medium">{event.title}</p>
              <div class="flex items-center gap-2 mt-1">
                <Clock size={14} class="text-muted-foreground" />
                <span class="text-xs text-muted-foreground">{event.date}</span>
                <Users size={14} class="text-muted-foreground ml-1" />
                <span class="text-xs text-muted-foreground">{event.participants}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-4">
        <button class="text-sm text-primary hover:text-primary/80 transition-colors">
          View calendar
        </button>
      </div>
    </div>
  </div>

  <!-- Quick Actions Section -->
  <div class="bg-card text-card-foreground p-5 rounded-lg shadow-sm border border-border">
    <h2 class="text-lg font-medium mb-4">Quick Actions</h2>

    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      <button class="bg-muted hover:bg-muted/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2">
        <Users size={20} class="text-primary" />
        <span class="text-sm">Add User</span>
      </button>

      <button class="bg-muted hover:bg-muted/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2">
        <File size={20} class="text-chart-2" />
        <span class="text-sm">New Report</span>
      </button>

      <button class="bg-muted hover:bg-muted/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2">
        <BarChart3 size={20} class="text-chart-3" />
        <span class="text-sm">Analytics</span>
      </button>

      <button class="bg-muted hover:bg-muted/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2">
        <Settings size={20} class="text-chart-4" />
        <span class="text-sm">Settings</span>
      </button>

      <button class="bg-muted hover:bg-muted/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2 sm:hidden lg:flex">
        <Calendar size={20} class="text-chart-5" />
        <span class="text-sm">Calendar</span>
      </button>

      <button class="bg-muted hover:bg-muted/80 transition-colors p-3 rounded-lg flex flex-col items-center justify-center gap-2 sm:hidden lg:flex">
        <Box size={20} class="text-primary" />
        <span class="text-sm">Inventory</span>
      </button>
    </div>
  </div>
</div>