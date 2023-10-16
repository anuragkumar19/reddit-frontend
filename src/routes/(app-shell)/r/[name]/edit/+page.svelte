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
	import { Avatar, FileButton, getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
	import axios from 'axios'
	import type { PageData } from './$types'
	import { goto, invalidateAll } from '$app/navigation'

	export let data: PageData

	const toastStore = getToastStore()
	const queryClient = useQueryClient()

	// const subredditQuery = createQuery<GetSubredditByNameResponse, AxiosApiError>({
	// 	queryFn: () =>
	// 		axios.get<GetSubredditByNameResponse>(`/r/${data.subreddit.id}`).then((res) => res.data),
	// 	queryKey: [`r/${data.subreddit.id}`],
	// 	initialData: {
	// 		subreddit: data.subreddit,
	// 	},
	// 	refetchOnMount: false,
	// 	refetchOnReconnect: false,
	// 	refetchOnWindowFocus: false,
	// })

	const updateTitle = createMutation<MessageResponse, AxiosApiError, UpdateSubredditTitleBody>({
		mutationFn: (body) =>
			axios.put<MessageResponse>(`/r/${data.subreddit.id}/title`, body).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Title updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await invalidateAll()
			await queryClient.invalidateQueries({ queryKey: [`r/${data.subreddit.id}`] })
		},
	})

	const updateAbout = createMutation<MessageResponse, AxiosApiError, UpdateSubredditAboutBody>({
		mutationFn: (body) =>
			axios.put<MessageResponse>(`/r/${data.subreddit.id}/about`, body).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'About updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await invalidateAll()
			await queryClient.invalidateQueries({ queryKey: [`r/${data.subreddit.id}`] })
		},
	})

	const updateAvatar = createMutation<MessageResponse, AxiosApiError, { file: File }>({
		mutationFn: (body) => {
			const formData = new FormData()

			formData.append('file', body.file)
			return axios
				.put<MessageResponse>(`/r/${data.subreddit.id}/avatar`, formData)
				.then((res) => res.data)
		},
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Avatar updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await invalidateAll()
			await queryClient.invalidateQueries({ queryKey: [`r/${data.subreddit.id}`] })
		},
	})

	const updateCover = createMutation<MessageResponse, AxiosApiError, { file: File }>({
		mutationFn: (body) => {
			const formData = new FormData()

			formData.append('file', body.file)
			return axios
				.put<MessageResponse>(`/r/${data.subreddit.id}/cover`, formData)
				.then((res) => res.data)
		},
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Cover updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await invalidateAll()
			await queryClient.invalidateQueries({ queryKey: [`r/${data.subreddit.id}`] })
		},
	})

	const deleteSubreddit = createMutation<MessageResponse, AxiosApiError>({
		mutationFn: () =>
			axios.delete<MessageResponse>(`/r/${data.subreddit.id}`).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Subreddit deleted, redirecting...',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await invalidateAll()
			await queryClient.invalidateQueries({ queryKey: [`r/${data.subreddit.id}`] })
			goto('/')
		},
	})

	let title = data.subreddit.title
	let about = data.subreddit.about
	let avatarImages: FileList | undefined = undefined
	let coverImages: FileList | undefined = undefined

	async function handleSubmit() {
		if (title !== data.subreddit.title) {
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

		if (about !== data.subreddit.about) {
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

	function handleAvatarUpload() {
		if (!avatarImages || avatarImages.length === 0 || !avatarImages[0].type.startsWith('image')) {
			toastStore.trigger({
				message: 'Please select an image for avatar',
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$updateAvatar.mutate({ file: avatarImages[0] })
	}

	function handleCoverUpload() {
		if (!coverImages || coverImages.length === 0 || !coverImages[0].type.startsWith('image')) {
			toastStore.trigger({
				message: 'Please select an image for cover',
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$updateCover.mutate({ file: coverImages[0] })
	}

	function handleDelete() {
		const response = prompt(
			`Are you sure you wanna delete this subreddit. All associated posts and replies will be deleted. This action will be irreversible. Please type r/${data.subreddit.name} in the box to continue.`,
		)

		if (response === `r/${data.subreddit.name}`) {
			$deleteSubreddit.mutate()
		}
	}

	$: loading =
		$updateAbout.isLoading ||
		$updateTitle.isLoading ||
		$updateAvatar.isLoading ||
		$updateCover.isLoading ||
		$deleteSubreddit.isLoading
	$: disabled = title == data.subreddit.title && about == data.subreddit.about
</script>

<svelte:head>
	<title>Edit r/{data.subreddit.name} | Reddit</title>
</svelte:head>
<main class="flex justify-center">
	<div class="card w-full max-w-sm mt-8">
		<header class="card-header text-center">
			<h3 class="h3 mt-1">Edit r/{data.subreddit.name}</h3>
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
					bind:files={avatarImages}
					disabled={loading}
					name="profile-avatar-update"
					button="btn variant-outline-secondary mb-2"
					width="w-full">Upload Avatar</FileButton
				>
				<FileButton
					bind:files={coverImages}
					disabled={loading}
					name="profile-avatar-update"
					button="btn variant-outline-tertiary"
					width="w-full">Upload Cover</FileButton
				>
			</form>
			{#if avatarImages && avatarImages.length > 0 && avatarImages[0].type.startsWith('image')}
				<div class="flex justify-center items-center mt-4">
					<Avatar src={URL.createObjectURL(avatarImages[0])} width="w-32" />
				</div>
				<button
					disabled={loading}
					class="btn variant-filled-primary w-full mt-2"
					on:click={handleAvatarUpload}>Upload</button
				>
			{/if}
			{#if coverImages && coverImages.length > 0 && coverImages[0].type.startsWith('image')}
				<div class="flex justify-center items-center mt-4">
					<img alt="" src={URL.createObjectURL(coverImages[0])} class="w-full rounded-md" />
				</div>
				<button
					disabled={loading}
					class="btn variant-filled-secondary w-full mt-2"
					on:click={handleCoverUpload}>Upload</button
				>
			{/if}
			<button
				disabled={loading}
				class="btn variant-filled-error w-full mt-2"
				on:click={handleDelete}>Delete Subreddit</button
			>
		</section>
	</div>
</main>
