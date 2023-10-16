<script lang="ts">
	import { page } from '$app/stores'
	import type {
		AxiosApiError,
		GetReplyRepliesResponse,
		GetReplyResponse,
		MessageResponse,
	} from '$lib/api/types'
	import ArrowDownIcon from '$lib/icons/arrow-down-icon.svelte'
	import ArrowUpIcon from '$lib/icons/arrow-up-icon.svelte'
	import CommentIcon from '$lib/icons/comment-icon.svelte'
	import TrashIcon from '$lib/icons/trash-icon.svelte'
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
	import axios from 'axios'
	import moment from 'moment'
	import { createEventDispatcher, onMount } from 'svelte'
	import Replies from './replies.svelte'
	import ReplyBox from './reply-box.svelte'
	import { onError } from '$lib/api/common'
	import { writable } from 'svelte/store'
	import { goto } from '$app/navigation'

	export let reply: GetReplyResponse['reply']
	$: replyAlt = writable(reply)

	let queryClient = useQueryClient()
	const toastStore = getToastStore()
	const dispatch = createEventDispatcher()

	const vote = createMutation<{ down: boolean }, AxiosApiError, { down: boolean }>({
		mutationFn: (body) =>
			axios.post<{ down: boolean }>(`/replies/${reply.id}/vote`, body).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(r) {
			replyAlt.update((reply) => {
				let addToDown = 0
				let addToUp = 0
				if (reply.vote === 0 && r.down) {
					addToDown = 1
				}

				if (reply.vote === 0 && !r.down) {
					addToUp = 1
				}

				if (reply.vote === 1 && r.down) {
					addToDown = 1
					addToUp = -1
				}

				if (reply.vote === -1 && !r.down) {
					addToDown = -1
					addToUp = 1
				}

				reply.up_vote_count += addToUp
				reply.down_vote_count += addToDown
				reply.vote = r.down ? -1 : 1

				return reply
			})
		},
	})

	const removeVote = createMutation<MessageResponse, AxiosApiError>({
		mutationFn: (body) =>
			axios.delete<MessageResponse>(`/replies/${reply.id}/vote`).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(r) {
			replyAlt.update((reply) => {
				if (reply.vote === 1) {
					reply.vote = 0
					reply.up_vote_count -= 1
				}

				if (reply.vote === -1) {
					reply.vote = 0
					reply.down_vote_count -= 1
				}

				return reply
			})
		},
	})

	const removeReply = createMutation<MessageResponse, AxiosApiError>({
		mutationFn: (body) =>
			axios.delete<MessageResponse>(`/replies/${reply.id}`).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(r) {
			dispatch('delete', reply.id)
		},
	})

	const repliesQuery = createQuery<GetReplyRepliesResponse, AxiosApiError>({
		queryFn: () =>
			axios
				.get<GetReplyRepliesResponse>(`/replies/${reply.id}/replies?limit=${reply.replies_count}`)
				.then((res) => res.data),
		queryKey: ['reply-reply', reply.id],
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		enabled: false,
	})

	let time = ''
	let show = false

	onMount(() => {
		time = moment(new Date(reply.created_at)).fromNow()
	})

	function handleAdd(e: CustomEvent<GetReplyResponse['reply']>) {
		replyAlt.update((r) => {
			r.replies_count += 1
			return r
		})

		if ($repliesQuery.data) {
			queryClient.setQueryData(['reply-reply', reply.id], (old: any) => ({
				replies: [e.detail, ...old.replies],
			}))
		} else {
			$repliesQuery.refetch()
		}
	}

	function voteReply(down: boolean) {
		if (!$page.data.auth) {
			goto('/auth/login')
			return
		}

		if (($replyAlt.vote === 1 && !down) || ($replyAlt.vote === -1 && down)) {
			$removeVote.mutate()
			return
		}

		$vote.mutate({ down })
	}

	function deleteReply(e: CustomEvent<number>) {
		if ($repliesQuery.data) {
			queryClient.setQueryData(['reply-reply', reply.id], (old: any) => ({
				replies: old.replies.filter((r: any) => r.id !== e.detail),
			}))
		}
	}
</script>

<div class="card my-4">
	<header class="card-header flex">
		<div class="flex gap-2 items-center">
			<Avatar src={$replyAlt.creator_avatar} width="w-8" />
			<span><a href="u/{$replyAlt.creator_username}">u/{$replyAlt.creator_username}</a></span>
			<span>•</span>
			<span>{time || new Date($replyAlt.created_at).toLocaleString()}</span>
			{#if $page.data.auth?.user.id === $replyAlt.creator_id}
				<span
					><button
						disabled={$removeReply.isLoading}
						on:click={() => $removeReply.mutate()}
						class="btn variant-filled-error btn-icon-sm btn-icon"><TrashIcon /></button
					></span
				>
			{/if}
		</div>
	</header>
	<section class="p-4">
		<p>{$replyAlt.content}</p>
	</section>
	<footer class="card-footer">
		<div class="flex items-center gap-2">
			<button
				disabled={$vote.isLoading || $removeVote.isLoading}
				class="btn btn-icon {$replyAlt.vote === 1 ? 'variant-filled-secondary' : ''}"
				on:click={() => voteReply(false)}><ArrowUpIcon /></button
			>
			<span>{$replyAlt.up_vote_count - $replyAlt.down_vote_count}</span>
			<button
				disabled={$vote.isLoading || $removeVote.isLoading}
				class="btn btn-icon {$replyAlt.vote === -1 ? 'variant-filled-secondary' : ''}"
				on:click={() => voteReply(true)}><ArrowDownIcon /></button
			>
			<button on:click={() => (show = !show)} class="btn"
				><CommentIcon /> <span>{$replyAlt.replies_count}</span></button
			>
			{#if reply.replies_count > 0 && !$repliesQuery.data}
				<button on:click={() => $repliesQuery.refetch()} class="btn"
					>View replies ({reply.replies_count})</button
				>
			{/if}
		</div>
	</footer>
</div>
{#if show}
	<ReplyBox reply={$replyAlt} on:add={handleAdd} />
{/if}
{#if $repliesQuery.isFetching}
	<h4 class="h4">Loading...</h4>
{/if}
{#if $repliesQuery.data}
	<Replies on:delete={deleteReply} replies={$repliesQuery.data.replies} />
{/if}
