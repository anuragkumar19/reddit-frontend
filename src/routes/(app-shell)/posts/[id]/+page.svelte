<script lang="ts">
	import { writable } from 'svelte/store'
	import Post from '../../post.svelte'
	import Replies from '../../replies.svelte'
	import ReplyBox from '../../reply-box.svelte'
	import type { PageData } from './$types'
	import type { GetReplyResponse } from '$lib/api/types'
	import { goto } from '$app/navigation'

	export let data: PageData
	$: writableData = writable(data)

	function handleAdd(e: CustomEvent<GetReplyResponse['reply']>) {
		writableData.update((x) => {
			x.post.replies_count += 1
			x.replies = [e.detail, ...x.replies]
			return x
		})
	}

	function handleDelete(e: CustomEvent<number>) {
		writableData.update((d) => {
			d.replies = d.replies.filter((r) => r.id !== e.detail)
			return d
		})
	}
</script>

<svelte:head>
	<title
		>Post on r/{$writableData.post.subreddit_name} by u/{$writableData.post.creator_username}</title
	>
</svelte:head>
<main class="my-8 px-4">
	<Post post={$writableData.post} on:delete={() => goto('/')} />
	<ReplyBox post={$writableData.post} on:add={handleAdd} />
	<h4 class="h4">Replies</h4>
	<Replies on:delete={handleDelete} replies={$writableData.replies} />
	<div class="mt-4">
		{#if data.page > 1}
			<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page - 1}`)}
				>Previous</button
			>
		{/if}
		{#if data.replies.length === 20}
			<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page + 1}`)}
				>Next</button
			>
		{/if}
	</div>
</main>
