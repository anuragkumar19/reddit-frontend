<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { onError } from '$lib/api/common'
	import type {
		AddLinkPostToASubredditBody,
		AddPostResponse,
		AddTextPostToASubredditBody,
		AxiosApiError,
		GetPostResponse,
		GetReplyResponse,
		ReplyBody,
	} from '$lib/api/types'
	import { createReplySchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'
	import { createEventDispatcher } from 'svelte'

	export let post: GetPostResponse['post'] | undefined = undefined
	export let reply: GetReplyResponse['reply'] | undefined = undefined

	const toastStore = getToastStore()
	const dispatch = createEventDispatcher()

	const createReply = createMutation<{ id: number }, AxiosApiError, ReplyBody, ReplyBody>({
		mutationFn: (body) => {
			if (post) {
				return axios.post<{ id: number }>(`/posts/${post.id}/reply`, body).then((res) => res.data)
			}
			if (reply) {
				return axios
					.post<{ id: number }>(`/replies/${reply.id}/reply`, body)
					.then((res) => res.data)
			}
			throw Error('You have to pass either of post or reply')
		},
		onError: onError(toastStore),
		async onSuccess(r) {
			const { data } = await axios.get<GetReplyResponse>(`/replies/${r.id}`)
			dispatch('add', data.reply)
			content = ''
		},
	})

	let content = ''

	function handleSubmit() {
		if (!$page.data.auth) {
			goto('/auth/login')
			return
		}
		const result = createReplySchema.safeParse({ content })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$createReply.mutate(result.data)
	}
</script>

<form class="my-4" on:submit|preventDefault={handleSubmit}>
	<label class="label mt-2">
		<span
			>{post
				? `Replying to post by u/${post.creator_username} on r/${post.subreddit_name}`
				: `Replying to reply by u/${reply?.creator_username}`}</span
		>
		<textarea
			class="textarea h-32"
			bind:value={content}
			disabled={$createReply.isLoading}
			placeholder="Text"
		/>
		<button disabled={$createReply.isLoading} type="submit" class="btn variant-filled-primary"
			>Send</button
		>
	</label>
</form>
