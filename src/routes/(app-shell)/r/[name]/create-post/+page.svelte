<script lang="ts">
	import { goto } from '$app/navigation'
	import { onError } from '$lib/api/common'
	import type {
		AddLinkPostToASubredditBody,
		AddPostResponse,
		AddTextPostToASubredditBody,
		AxiosApiError,
		GetSubredditByNameResponse,
	} from '$lib/api/types'
	import {
		createLinkPostSchema,
		createMediaPostSchema,
		createTextPostSchema,
	} from '$lib/validations/zod'
	import { FileDropzone, getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
	import axios from 'axios'
	import type { PageData } from './$types'

	export let data: PageData

	type PostTypes = 'link' | 'image' | 'video' | 'text'

	let title = ''
	let text = ''
	let link = ''
	let select: PostTypes = 'text'
	let images: FileList | undefined = undefined
	let videos: FileList | undefined = undefined
	let imagePreview = ''
	let videoPreview = ''

	const toastStore = getToastStore()
	const queryClient = useQueryClient()

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

	async function onSuccess(data: AddPostResponse) {
		toastStore.trigger({
			message: 'Post created. Redirecting...',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})

		await queryClient.invalidateQueries({
			queryKey: [`r/${$subredditQuery.data.subreddit.id}/posts`],
		})
		goto(`/posts/${data.id}`)
	}

	const createPost = createMutation<
		AddPostResponse,
		AxiosApiError,
		| { type: 'text'; body: AddTextPostToASubredditBody }
		| { type: 'link'; body: AddLinkPostToASubredditBody }
		| { type: 'image' | 'video'; body: FormData }
	>({
		mutationFn: (data) =>
			axios
				.post<AddPostResponse>(
					`/r/${$subredditQuery.data.subreddit.id}/posts/${data.type}`,
					data.body,
				)
				.then((res) => res.data),
		onError: onError(toastStore),
		onSuccess,
	})

	async function handleSubmit() {
		if (select === 'text') {
			const result = createTextPostSchema.safeParse({ title, text })

			if (!result.success) {
				toastStore.trigger({
					message: result.error.errors[0].message,
					background: 'variant-filled-warning',
					autohide: true,
					timeout: 4000,
				})
				return
			}

			$createPost.mutate({ type: 'text', body: result.data })
			return
		}

		if (select === 'link') {
			const result = createLinkPostSchema.safeParse({ title, link, text })

			if (!result.success) {
				toastStore.trigger({
					message: result.error.errors[0].message,
					background: 'variant-filled-warning',
					autohide: true,
					timeout: 4000,
				})
				return
			}

			$createPost.mutate({ type: 'link', body: result.data })
			return
		}

		let file: File
		if (select == 'image') {
			if (!images || images.length === 0 || !images[0].type.startsWith('image')) {
				toastStore.trigger({
					message: 'Please select an image',
					background: 'variant-filled-warning',
					autohide: true,
					timeout: 4000,
				})
				return
			}

			file = images[0]
		} else {
			if (!videos || videos.length === 0 || !videos[0].type.startsWith('video')) {
				toastStore.trigger({
					message: 'Please select a video',
					background: 'variant-filled-warning',
					autohide: true,
					timeout: 4000,
				})
				return
			}

			file = videos[0]
		}

		const result = createMediaPostSchema.safeParse({ title, text })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		const formData = new FormData()
		formData.append('title', result.data.title)
		formData.append('text', result.data.text)
		formData.append('file', file)

		$createPost.mutate({ type: select, body: formData })
	}

	$: {
		if (images && images.length > 0 && images[0].type.startsWith('image')) {
			imagePreview = URL.createObjectURL(images[0])
		}
	}
	$: {
		if (videos && videos.length > 0 && videos[0].type.startsWith('video')) {
			videoPreview = URL.createObjectURL(videos[0])
		}
	}
</script>

<svelte:head>
	<title>Create post r/{subreddit.name} | Reddit</title>
</svelte:head>
<main class="px-4 mt-8">
	<h2 class="h2">Create post @ r/{subreddit.name}</h2>
	<form on:submit|preventDefault={handleSubmit}>
		<label class="label">
			<span>Title</span>
			<input
				class="input"
				type="text"
				placeholder="Post title"
				bind:value={title}
				disabled={$createPost.isLoading}
			/>
		</label>
		<label class="label mt-2">
			<span>Text</span>
			<textarea
				class="textarea h-32"
				bind:value={text}
				disabled={$createPost.isLoading}
				placeholder="Text"
			/>
		</label>

		<label class="label my-2">
			<span>Select post type</span>
			<select class="select" size="4" bind:value={select} disabled={$createPost.isLoading}>
				<option value="text">Text</option>
				<option value="link">Link</option>
				<option value="image">Image</option>
				<option value="video">Video</option>
			</select>
		</label>
		{#if select === 'link'}
			<label class="label">
				<span>Link</span>
				<input
					class="input"
					type="text"
					placeholder="Link"
					bind:value={link}
					disabled={$createPost.isLoading}
				/>
			</label>
		{/if}
		{#if select == 'image'}
			<FileDropzone
				name="post-{subreddit.name}-image"
				bind:files={images}
				disabled={$createPost.isLoading}
			>
				<svelte:fragment slot="message">Upload an image (Drop or Select)</svelte:fragment>
			</FileDropzone>
			{#if imagePreview}
				<img src={imagePreview} alt="" class="w-100 block mt-4" />
			{/if}
		{/if}
		{#if select == 'video'}
			<FileDropzone
				name="post-{subreddit.name}-video"
				bind:files={videos}
				disabled={$createPost.isLoading}
			>
				<svelte:fragment slot="message">Upload an video (Drop or Select)</svelte:fragment>
			</FileDropzone>
			{#if videoPreview}
				<video src={videoPreview} class="w-100 block mt-4" controls autoplay muted />
			{/if}
		{/if}
		<button class="btn variant-filled-primary mt-4" type="submit" disabled={$createPost.isLoading}
			>Create post</button
		>
	</form>
</main>
