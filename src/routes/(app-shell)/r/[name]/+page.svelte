<script lang="ts">
	import { goto } from '$app/navigation'
	import { Avatar } from '@skeletonlabs/skeleton'
	import Posts from '../../posts.svelte'
	import JoinButton from '../join-button.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: posts = data.posts
	$: subreddit = data.subreddit
</script>

<svelte:head>
	<title>r/{subreddit.name} | Reddit</title>
</svelte:head>
<main class="pt-8 px-6">
	<div
		class="flex items-center gap-4 py-4 px-4"
		style="background: url({subreddit.cover}) center center/cover;"
	>
		<Avatar src={subreddit.avatar} width="w-16" rounded="rounded-full" />
		<div class="flex items-center justify-between gap-4">
			<h3 class="h3">r/{subreddit.name}</h3>
			<JoinButton {subreddit} />
			{#if subreddit.creator_id === data.auth?.user.id}
				<a href={`/r/${subreddit.name}/edit`} class="btn variant-outline-tertiary btn-sm">Edit</a>
			{/if}
			<span>{subreddit.member_count} members</span>
			<span>Since {new Date(subreddit.created_at).toLocaleDateString()}</span>
		</div>
	</div>
	{#if subreddit.about || subreddit.title}
		<div class="card w-full mt-4">
			<section class="p-4">
				{#if subreddit.title}
					<h4 class="h4">{subreddit.title}</h4>
				{/if}
				{#if subreddit.about}
					<p>{subreddit.about}</p>
				{/if}
			</section>
		</div>
	{/if}
	<a href="/r/{subreddit.name}/create-post" class="btn variant-outline-primary mt-8"
		>Create a Post</a
	>

	<section class="my-4">
		<Posts {posts} />
		<div class="mt-4">
			{#if data.page > 1}
				<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page - 1}`)}
					>Previous</button
				>
			{/if}
			{#if posts.length === 10}
				<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page + 1}`)}
					>Next</button
				>
			{/if}
		</div>
	</section>
</main>
