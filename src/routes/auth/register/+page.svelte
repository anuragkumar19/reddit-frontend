<script lang="ts">
	import { goto } from '$app/navigation'
	import { onError } from '$lib/api/common'
	import type { MessageResponse, AxiosApiError, RegisterBody } from '$lib/api/types'
	import { registerSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'

	const toastStore = getToastStore()

	let name = ''
	let username = ''
	let email = ''
	let password = ''

	const register = createMutation<MessageResponse, AxiosApiError, RegisterBody>({
		mutationFn: (data) =>
			axios.post<MessageResponse>('/auth/register', data).then((res) => res.data),
		onError: onError(toastStore),
		onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Registered. An OTP is sent to your email for verification',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			sessionStorage.setItem('register_data', JSON.stringify(variables))
			goto('/auth/verify-email')
		},
	})

	async function handleSubmit() {
		const result = registerSchema.safeParse({ email, name, username, password })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$register.mutate(result.data)
	}
</script>

<svelte:head>
	<title>Create an account | Reddit</title>
</svelte:head>
<div class="card w-full max-w-sm">
	<header class="card-header text-center">
		<img
			src="https://www.redditinc.com/assets/images/site/reddit-logo.png"
			alt="Reddit"
			class="w-14 mx-auto"
		/>
		<h2 class="h2 mt-1">Reddit</h2>
		<h3 class="h3 mt-4">Create an account</h3>
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
					disabled={$register.isLoading}
				/>
			</label>
			<label class="label">
				<span>Email</span>
				<input
					class="input"
					type="text"
					placeholder="john_deo@example.com"
					autocomplete="email"
					bind:value={email}
					disabled={$register.isLoading}
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
					disabled={$register.isLoading}
				/>
			</label>
			<label class="label">
				<span>Password</span>
				<input
					class="input"
					type="password"
					placeholder="•••••••••••••"
					autocomplete="new-password"
					bind:value={password}
					disabled={$register.isLoading}
				/>
			</label>
			<button disabled={$register.isLoading} type="submit" class="btn variant-filled mt-2 w-full"
				>Continue</button
			>
			<p class="mt-2 text-center">
				<a href="/auth/login">Already have an account? Login</a>
			</p>
		</form>
	</section>
</div>
