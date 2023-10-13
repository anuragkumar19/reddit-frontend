<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton'
	import Header from './header.svelte'
	import type { PageData } from './$types'
	import Sidebar from './sidebar.svelte'

	export let data: PageData
</script>

<AppShell>
	<svelte:fragment slot="header">
		<Header auth={data.auth} />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Sidebar />
	</svelte:fragment>

	<!-- Router Slot -->
	<slot />
</AppShell>
