<script lang="ts">
	import type { SearchSubredditResponse, UserMeResponse } from '$lib/api/types'
	import { Avatar } from '@skeletonlabs/skeleton'
	import JoinButton from './r/join-button.svelte'

	export let items: SearchSubredditResponse['items']
	export let joinButton: boolean = true
</script>

<ul class="list">
	{#each items as subreddit}
		<li>
			<span><Avatar src={subreddit.avatar} width="w-10" /></span>
			<span class="flex-auto"><a href="/r/{subreddit.name}">r/{subreddit.name}</a></span>
			{#if joinButton}
				<JoinButton {subreddit} />
			{/if}
		</li>
	{/each}
</ul>
