<script lang="ts">
	let { children } = $props();
	import { page } from '$app/stores';

	// Sidebar state for mobile responsiveness
	let sidebarOpen = false;

	// Example navigation items
	const navItems = [
		{ name: 'Dashboard', icon: 'home', href: '/dashboard', active: true },
		{ name: 'Projects', icon: 'briefcase', href: '/dashboard/projects' },
		{ name: 'Tasks', icon: 'check-square', href: '/dashboard/tasks' },
		{ name: 'Messages', icon: 'message-circle', href: '/dashboard/messages' },
		{ name: 'Analytics', icon: 'bar-chart', href: '/dashboard/analytics' },
		{ name: 'Settings', icon: 'settings', href: '/dashboard/settings' }
	];
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<aside class="hidden md:flex md:flex-col w-64 bg-indigo-700 text-white">
		<div class="p-4 flex items-center">
			<span class="text-xl font-bold">NxtApply</span>
		</div>
		<nav class="flex-1 overflow-y-auto">
			<ul class="p-2 space-y-2">
				{#each navItems as item}
					<li>
						<a href={item.href} class="flex items-center p-3 rounded-lg hover:bg-indigo-600 transition-colors {$page.url.pathname === item.href ? 'bg-indigo-800' : ''}">
							<span class="mr-3">{item.icon}</span> <!-- Replace with your icon system -->
							<span>{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="p-4 border-t border-indigo-800">
			<div class="flex items-center">
				<div class="h-8 w-8 rounded-full bg-indigo-500 mr-3"></div>
				<div>
					<p class="font-medium">User Name</p>
					<p class="text-xs text-indigo-200">user@example.com</p>
				</div>
			</div>
		</div>
	</aside>

	<!-- Mobile sidebar toggle button -->
	<button
		on:click={() => sidebarOpen = !sidebarOpen}
		class="md:hidden fixed bottom-4 right-4 z-40 bg-indigo-600 text-white p-3 rounded-full shadow-lg">
		≡
	</button>

	<!-- Mobile sidebar -->
	{#if sidebarOpen}
		<div class="fixed inset-0 bg-black bg-opacity-50 z-30" on:click={() => sidebarOpen = false}></div>
		<aside class="fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white z-40 md:hidden">
			<!-- Same content as desktop sidebar -->
			<div class="p-4 flex items-center">
				<span class="text-xl font-bold">NxtApply</span>
			</div>
			<nav class="flex-1 overflow-y-auto">
				<ul class="p-2 space-y-2">
					{#each navItems as item}
						<li>
							<a href={item.href} class="flex items-center p-3 rounded-lg hover:bg-indigo-600 transition-colors {$page.url.pathname === item.href ? 'bg-indigo-800' : ''}">
								<span class="mr-3">{item.icon}</span>
								<span>{item.name}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>
	{/if}

	<!-- Main content -->
	<div class="flex-1 flex flex-col overflow-hidden">
		<!-- Top header/navbar -->
		<header class="bg-white shadow">
			<div class="flex items-center justify-between p-4">
				<h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
				<div class="flex items-center space-x-4">
					<button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
						<!-- Bell icon for notifications -->
						🔔
					</button>
					<button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
						<!-- Settings icon -->
						⚙️
					</button>
				</div>
			</div>
		</header>

		<!-- Main content area -->
		<main class="flex-1 overflow-y-auto p-6 bg-gray-100">
			<!-- Render children here -->
			{@render children()}
		</main>
	</div>
</div>
