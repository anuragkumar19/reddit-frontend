<script lang="ts">
	import { onError } from '$lib/api/common'
	import type {
		AxiosApiError,
		MessageResponse,
		UpdateAvatarBody,
		UpdateNameBody,
		UpdateUsernameBody,
	} from '$lib/api/types'
	import { updateNameSchema, updateUsernameSchema } from '$lib/validations/zod'
	import { FileButton, getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'
	import type { PageData } from './$types'
	import { invalidateAll } from '$app/navigation'

	export let data: PageData

	const toastStore = getToastStore()

	let name = data.auth.user.name
	let username = data.auth.user.username

	export const updateName = createMutation<MessageResponse, AxiosApiError, UpdateNameBody>({
		mutationFn: (data) => axios.put<MessageResponse>('/user/name', data).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Name updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})
			await invalidateAll()
		},
	})

	export const updateUsername = createMutation<MessageResponse, AxiosApiError, UpdateUsernameBody>({
		mutationFn: (data) =>
			axios.put<MessageResponse>('/user/username', data).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Username updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})
			await invalidateAll()
		},
	})

	export const updateAvatar = createMutation<MessageResponse, AxiosApiError, UpdateAvatarBody>({
		mutationFn: (data) => {
			const formData = new FormData()
			formData.append('file', data.file)
			return axios.put<MessageResponse>('/user/avatar', formData).then((res) => res.data)
		},
		onError: onError(toastStore),
		onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Avatar updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})
		},
	})

	$: disabled = name === data.auth.user.name && username === data.auth.user.username

	$: loading = $updateUsername.isLoading || $updateName.isLoading || $updateAvatar.isLoading

	async function handleSubmit() {
		if (username !== data.auth.user.username) {
			;(() => {
				const result = updateUsernameSchema.safeParse({ username })

				if (!result.success) {
					toastStore.trigger({
						message: result.error.errors[0].message,
						background: 'variant-filled-warning',
						autohide: true,
						timeout: 4000,
					})
					return
				}
				$updateUsername.mutate(result.data)
			})()
		}

		if (name !== data.auth.user.name) {
			;(() => {
				const result = updateNameSchema.safeParse({ name })

				if (!result.success) {
					toastStore.trigger({
						message: result.error.errors[0].message,
						background: 'variant-filled-warning',
						autohide: true,
						timeout: 4000,
					})
					return
				}
				$updateName.mutate(result.data)
			})()
		}
	}
</script>

<svelte:head>
	<title>Settings | Reddit</title>
</svelte:head>
<main class="flex justify-center">
	<div class="card w-full max-w-sm mt-8">
		<header class="card-header text-center">
			<h2 class="h2 mt-1">Settings</h2>
		</header>
		<section class="p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>Name</span>
					<input
						class="input"
						type="text"
						placeholder="John Deo"
						autocomplete="name"
						bind:value={name}
						disabled={loading}
					/>
				</label>
				<label class="label">
					<span>Username</span>
					<input
						class="input"
						type="text"
						placeholder="john_deo"
						autocomplete="username"
						bind:value={username}
						disabled={loading}
					/>
				</label>
				<button
					disabled={disabled || loading}
					type="submit"
					class="btn variant-filled-primary my-2 w-full">Save</button
				>
				<FileButton
					disabled={loading}
					name="profile-avatar-update"
					button="btn variant-filled-secondary"
					width="w-full">Upload Avatar</FileButton
				>
			</form>
		</section>
	</div>
</main>
