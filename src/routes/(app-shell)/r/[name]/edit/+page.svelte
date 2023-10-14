<script lang="ts">
	import { onError } from '$lib/api/common'
	import type {
		AxiosApiError,
		GetSubredditByNameResponse,
		MessageResponse,
		UpdateSubredditAboutBody,
		UpdateSubredditTitleBody,
	} from '$lib/api/types'
	import { updateSubredditAboutSchema, updateSubredditTitleSchema } from '$lib/validations/zod'
	import { FileButton, getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
	import axios from 'axios'
	import type { PageData } from './$types'

	export let data: PageData

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

	const updateTitle = createMutation<MessageResponse, AxiosApiError, UpdateSubredditTitleBody>({
		mutationFn: (data) =>
			axios
				.put<MessageResponse>(`/r/${$subredditQuery.data.subreddit.id}/title`, data)
				.then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Title updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await queryClient.invalidateQueries({ queryKey: [`r/${$subredditQuery.data.subreddit.id}`] })
		},
	})

	const updateAbout = createMutation<MessageResponse, AxiosApiError, UpdateSubredditAboutBody>({
		mutationFn: (data) =>
			axios
				.put<MessageResponse>(`/r/${$subredditQuery.data.subreddit.id}/about`, data)
				.then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'About updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await queryClient.invalidateQueries({ queryKey: [`r/${$subredditQuery.data.subreddit.id}`] })
		},
	})

	let title = $subredditQuery.data.subreddit.title
	let about = $subredditQuery.data.subreddit.about

	async function handleSubmit() {
		if (title !== $subredditQuery.data.subreddit.title) {
			;(() => {
				const result = updateSubredditTitleSchema.safeParse({ title })

				if (!result.success) {
					toastStore.trigger({
						message: result.error.errors[0].message,
						background: 'variant-filled-warning',
						autohide: true,
						timeout: 4000,
					})
					return
				}
				$updateTitle.mutate(result.data)
			})()
		}

		if (about !== $subredditQuery.data.subreddit.about) {
			;(() => {
				const result = updateSubredditAboutSchema.safeParse({ about })

				if (!result.success) {
					toastStore.trigger({
						message: result.error.errors[0].message,
						background: 'variant-filled-warning',
						autohide: true,
						timeout: 4000,
					})
					return
				}
				$updateAbout.mutate(result.data)
			})()
		}
	}

	$: loading = $updateAbout.isLoading || $updateTitle.isLoading
	$: disabled =
		title == $subredditQuery.data.subreddit.title && about == $subredditQuery.data.subreddit.about
</script>

<svelte:head>
	<title>Edit r/{$subredditQuery.data.subreddit.name} | Reddit</title>
</svelte:head>
<main class="flex justify-center">
	<div class="card w-full max-w-sm mt-8">
		<header class="card-header text-center">
			<h3 class="h3 mt-1">Edit r/{$subredditQuery.data.subreddit.name}</h3>
		</header>
		<section class="p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>Title</span>
					<input class="input" type="text" bind:value={title} disabled={loading} />
				</label>
				<label class="label">
					<span>About</span>
					<textarea class="textarea" bind:value={about} disabled={loading} />
				</label>
				<button
					disabled={disabled || loading}
					type="submit"
					class="btn variant-filled-primary my-2 w-full">Save</button
				>
				<FileButton
					disabled={loading}
					name="profile-avatar-update"
					button="btn variant-outline-secondary mb-2"
					width="w-full">Upload Avatar</FileButton
				>
				<FileButton
					disabled={loading}
					name="profile-avatar-update"
					button="btn variant-outline-tertiary"
					width="w-full">Upload Cover</FileButton
				>
			</form>
		</section>
	</div>
</main>
