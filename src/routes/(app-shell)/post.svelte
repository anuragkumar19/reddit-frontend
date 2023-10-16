<script lang="ts">
	import type { AxiosApiError, GetPostResponse, MessageResponse } from '$lib/api/types'
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton'
	import ArrowUpIcon from '$lib/icons/arrow-up-icon.svelte'
	import ArrowDownIcon from '$lib/icons/arrow-down-icon.svelte'
	import CommentIcon from '$lib/icons/comment-icon.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import moment from 'moment'
	import { page } from '$app/stores'
	import TrashIcon from '$lib/icons/trash-icon.svelte'
	import { writable } from 'svelte/store'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'
	import { onError } from '$lib/api/common'
	import { goto } from '$app/navigation'

	let time = ''

	export let post: GetPostResponse['post']

	const toastStore = getToastStore()
	const dispatch = createEventDispatcher()

	const vote = createMutation<{ down: boolean }, AxiosApiError, { down: boolean }>({
		mutationFn: (body) =>
			axios.post<{ down: boolean }>(`/posts/${post.id}/vote`, body).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(r) {
			postAlt.update((p) => {
				let addToDown = 0
				let addToUp = 0
				if (p.vote === 0 && r.down) {
					addToDown = 1
				}

				if (p.vote === 0 && !r.down) {
					addToUp = 1
				}

				if (p.vote === 1 && r.down) {
					addToDown = 1
					addToUp = -1
				}

				if (p.vote === -1 && !r.down) {
					addToDown = -1
					addToUp = 1
				}

				p.up_vote_count += addToUp
				p.down_vote_count += addToDown
				p.vote = r.down ? -1 : 1

				return p
			})
		},
	})

	const removeVote = createMutation<MessageResponse, AxiosApiError>({
		mutationFn: (body) =>
			axios.delete<MessageResponse>(`/posts/${post.id}/vote`).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(r) {
			postAlt.update((p) => {
				if (p.vote === 1) {
					p.vote = 0
					p.up_vote_count -= 1
				}

				if (p.vote === -1) {
					p.vote = 0
					p.down_vote_count -= 1
				}

				return p
			})
		},
	})

	const removePost = createMutation<MessageResponse, AxiosApiError>({
		mutationFn: (body) =>
			axios.delete<MessageResponse>(`/posts/${post.id}`).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(r) {
			dispatch('delete', post.id)
		},
	})

	onMount(() => {
		time = moment(new Date(post.created_at)).fromNow()
	})

	function votePost(down: boolean) {
		if (!$page.data.auth) {
			goto('/auth/login')
			return
		}

		if (($postAlt.vote === 1 && !down) || ($postAlt.vote === -1 && down)) {
			$removeVote.mutate()
			return
		}

		$vote.mutate({ down })
	}

	$: postAlt = writable(post)
</script>

<div class="card my-4">
	<header class="card-header flex">
		<div class="flex gap-2 items-center">
			<Avatar src={$postAlt.subreddit_avatar} width="w-8" />
			<span><a href="/r/{$postAlt.subreddit_name}">r/{$postAlt.subreddit_name}</a></span>
			<span class="">|</span>
			<Avatar src={$postAlt.creator_avatar} width="w-8" />
			<span><a href="/u/{$postAlt.creator_username}">u/{$postAlt.creator_username}</a></span>
			<span>•</span>
			<span>{time || new Date($postAlt.created_at).toLocaleString()}</span>
			{#if $page.data.auth?.user.id === $postAlt.creator_id}
				<span
					><button
						disabled={$removePost.isLoading}
						class="btn variant-filled-error btn-icon-sm btn-icon"
						on:click={() =>
							confirm('Are you sure you want to delete this post?') ? $removePost.mutate() : ''}
						><TrashIcon /></button
					></span
				>
			{/if}
		</div>
	</header>
	<section class="p-4">
		<h3 class="h3">{$postAlt.title}</h3>
		{#if $postAlt.text}
			<p>
				{$postAlt.text}
			</p>
		{/if}
		{#if $postAlt.image}
			<div class="overflow-hidden" style="max-height: 500px;">
				<img class="w-full max-w-md" src={$postAlt.image} alt="" />
			</div>
		{/if}
		{#if $postAlt.video}
			<div class="overflow-hidden">
				<video class="w-full max-w-md" src={$postAlt.video} muted controls />
			</div>
		{/if}
		{#if $postAlt.link}
			<a class="text-blue-600" href={$postAlt.link}>{$postAlt.link}</a>
		{/if}
	</section>
	<footer class="card-footer">
		<div class="flex items-center gap-2">
			<button
				disabled={$vote.isLoading || $removeVote.isLoading}
				class="btn btn-icon {$postAlt.vote === 1 ? 'variant-filled-secondary' : ''}"
				on:click={() => votePost(false)}><ArrowUpIcon /></button
			>
			<span>{$postAlt.up_vote_count - $postAlt.down_vote_count}</span>
			<button
				disabled={$vote.isLoading || $removeVote.isLoading}
				class="btn btn-icon {$postAlt.vote === -1 ? 'variant-filled-secondary' : ''}"
				on:click={() => votePost(true)}><ArrowDownIcon /></button
			>
			<a href="/posts/{$postAlt.id}" class="btn"
				><CommentIcon /> <span>{$postAlt.replies_count}</span></a
			>
		</div>
	</footer>
</div>
