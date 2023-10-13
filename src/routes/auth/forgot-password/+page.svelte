<script lang="ts">
	import { goto } from '$app/navigation'
	import { onError } from '$lib/api/common'
	import type { MessageResponse, AxiosApiError, ForgotPasswordBody } from '$lib/api/types'
	import { forgotPasswordSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'

	const toastStore = getToastStore()

	let email = ''

	export const forgotPassword = createMutation<MessageResponse, AxiosApiError, ForgotPasswordBody>({
		mutationFn: (data) =>
			axios.post<MessageResponse>('/auth/forgot-password', data).then((res) => res.data),
		onError: onError(toastStore),
		onSuccess(_, variables) {
			toastStore.trigger({
				message: 'An OTP is sent to your email.',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			sessionStorage.setItem('forgot_password_email', variables.email)
			goto('/auth/reset-password')
		},
	})

	async function handleSubmit() {
		const result = forgotPasswordSchema.safeParse({ email })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$forgotPassword.mutate(result.data)
	}
</script>

<svelte:head>
	<title>Forgot password | Reddit</title>
</svelte:head>
<div class="card w-full max-w-sm">
	<header class="card-header text-center">
		<img
			src="https://www.redditinc.com/assets/images/site/reddit-logo.png"
			alt="Reddit"
			class="w-14 mx-auto"
		/>
		<h2 class="h2 mt-1">Reddit</h2>
		<h3 class="h3 mt-4">Forgot Password</h3>
	</header>
	<section class="p-4">
		<form on:submit|preventDefault={handleSubmit}>
			<label class="label">
				<span>Email</span>
				<input
					class="input"
					type="text"
					placeholder="john_deo@example.com"
					autocomplete="email"
					bind:value={email}
					disabled={$forgotPassword.isLoading}
				/>
			</label>
			<button
				disabled={$forgotPassword.isLoading}
				type="submit"
				class="btn variant-filled mt-2 w-full">Continue</button
			>
			<p class="mt-2 text-center">
				<a href="/auth/login">Back {'>'}</a>
			</p>
		</form>
	</section>
</div>
