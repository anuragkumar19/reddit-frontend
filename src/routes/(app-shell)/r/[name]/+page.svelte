<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton'
	import type { PageData } from './$types'
	import { createQuery } from '@tanstack/svelte-query'
	import type { AxiosApiError, GetSubredditByNameResponse } from '$lib/api/types'
	import axios from 'axios'
	import JoinButton from '../join-button.svelte'

	export let data: PageData

	const subredditQuery = createQuery<GetSubredditByNameResponse, AxiosApiError>({
		queryFn: () =>
			axios.get<GetSubredditByNameResponse>(`/r/${data.subreddit.id}`).then((res) => res.data),
		queryKey: [`r/${data.subreddit.id}`],
		initialData: {
			subreddit: data.subreddit,
		},
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})

	$: subreddit = $subredditQuery.data.subreddit
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
			<JoinButton {subreddit} auth={data.auth} />
			{#if subreddit.creator_id === data.auth?.user.id}
				<a href={`/r/${subreddit.name}/edit`} class="btn variant-outline-tertiary btn-sm">Edit</a>
			{/if}
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
	<button class="btn variant-outline-primary mt-8">Create a Post</button>
</main>
