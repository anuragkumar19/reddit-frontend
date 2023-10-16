<script lang="ts">
	import type { AxiosApiError, TopSubredditResponse, UserMeResponse } from '$lib/api/types'
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
	import { createQuery } from '@tanstack/svelte-query'
	import axios from 'axios'
	import SubredditList from './subreddit-list.svelte'

	const modalStore = getModalStore()

	const subredditQuery = createQuery<TopSubredditResponse, AxiosApiError>({
		queryFn: () => axios.get<TopSubredditResponse>(`/feed/r/top`).then((res) => res.data),
		queryKey: [`top-subreddit`],
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})
</script>

<div class="w-0 hidden md:w-72 md:block px-4 h-screen">
	<h3 class="h3 my-4">Top 10 subreddit</h3>
	{#if $subredditQuery.isLoading}
		{#each { length: 10 } as _, i}
			<div class="placeholder animate-pulse mt-2" />
		{/each}
	{/if}
	{#if !$subredditQuery.isLoading && $subredditQuery.data}
		<SubredditList items={$subredditQuery.data.items} />
	{/if}
	<a href="/create-subreddit" class="btn btn-lg w-full variant-filled-primary mt-4">
		Create Community
	</a>
</div>
