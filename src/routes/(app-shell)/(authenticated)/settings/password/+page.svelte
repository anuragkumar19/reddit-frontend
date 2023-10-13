<script lang="ts">
	import { onError } from '$lib/api/common'
	import type { MessageResponse, AxiosApiError, UpdatePasswordBody } from '$lib/api/types'
	import { updatePasswordSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'

	const toastStore = getToastStore()

	let old_password = ''
	let new_password = ''

	export const updatePassword = createMutation<MessageResponse, AxiosApiError, UpdatePasswordBody>({
		mutationFn: (data) =>
			axios.put<MessageResponse>('/user/password', data).then((res) => res.data),
		onError: onError(toastStore),
		onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Password updated',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})
		},
	})

	async function handleSubmit() {
		const result = updatePasswordSchema.safeParse({ old_password, new_password })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$updatePassword.mutate(result.data)
	}
</script>

<svelte:head>
	<title>Change password | Reddit</title>
</svelte:head>
<main class="flex justify-center">
	<div class="card w-full max-w-sm mt-8">
		<header class="card-header text-center">
			<h2 class="h2 mt-1">Settings</h2>
		</header>
		<section class="p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>Current password</span>
					<input
						class="input"
						type="password"
						autocomplete="current-password"
						bind:value={old_password}
						disabled={$updatePassword.isLoading}
					/>
				</label>
				<label class="label">
					<span>New Password</span>
					<input
						class="input"
						type="password"
						placeholder=""
						autocomplete="new-password"
						bind:value={new_password}
						disabled={$updatePassword.isLoading}
					/>
				</label>
				<button
					disabled={$updatePassword.isLoading}
					type="submit"
					class="btn variant-filled-primary my-2 w-full">Save</button
				>
			</form>
		</section>
	</div>
</main>
