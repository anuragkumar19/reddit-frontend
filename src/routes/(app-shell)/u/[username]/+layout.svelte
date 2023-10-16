<script lang="ts">
	import { Avatar, TabAnchor, TabGroup } from '@skeletonlabs/skeleton'
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'

	export let data: LayoutData

	$: user = data.user
</script>

<svelte:head>
	<title>u/{user.username} | Reddit</title>
</svelte:head>
<main class="pt-8 px-6">
	<div class="flex items-center gap-4 py-4 px-4">
		<Avatar src={user.avatar} width="w-16" rounded="rounded-full" />
		<div class="flex items-center justify-between gap-4">
			<h3 class="h3">u/{user.username} ({user.name})</h3>
			{#if user.id === data.auth?.user.id}
				<a href={`/settings/profile`} class="btn variant-outline-tertiary btn-sm">Edit</a>
				<a href={`/settings/password`} class="btn variant-outline-tertiary btn-sm">Settings</a>
			{/if}
			<span>Since {new Date(user.created_at).toLocaleDateString()}</span>
		</div>
	</div>

	<TabGroup>
		<TabAnchor href="/u/{user.username}" selected={$page.url.pathname === `/u/${user.username}`}>
			<span>Posts</span>
		</TabAnchor>
		<TabAnchor
			href="/u/{user.username}/replies"
			selected={$page.url.pathname === `/u/${user.username}/replies`}
		>
			<span>Replies</span>
		</TabAnchor>
		<TabAnchor
			href="/u/{user.username}/joined"
			selected={$page.url.pathname === `/u/${user.username}/joined`}
		>
			<span>Joined subreddit</span>
		</TabAnchor>
	</TabGroup>

	<slot />
</main>
