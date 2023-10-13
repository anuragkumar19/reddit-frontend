<script lang="ts">
	import { onError } from '$lib/api/common'
	import type { LoginResponse, AxiosApiError, LoginBody } from '$lib/api/types'
	import { loginSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'
	import Cookies from 'js-cookie'

	const toastStore = getToastStore()

	let identifier = ''
	let password = ''

	export const login = createMutation<LoginResponse, AxiosApiError, LoginBody>({
		mutationFn: (data) => axios.post<LoginResponse>('/auth/login', data).then((res) => res.data),
		onError: onError(toastStore),
		onSuccess(data, variables) {
			Cookies.set('access_token', data.token, {
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			})
			window.location.href = '/'
		},
	})

	async function handleSubmit() {
		const result = loginSchema.safeParse({ identifier, password })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$login.mutate(result.data)
	}
</script>

<svelte:head>
	<title>Login | Reddit</title>
</svelte:head>
<div class="card w-full max-w-sm">
	<header class="card-header text-center">
		<img
			src="https://www.redditinc.com/assets/images/site/reddit-logo.png"
			alt="Reddit"
			class="w-14 mx-auto"
		/>
		<h2 class="h2 mt-1">Reddit</h2>
		<h3 class="h3 mt-4">Welcome back!</h3>
	</header>
	<section class="p-4">
		<form on:submit|preventDefault={handleSubmit}>
			<label class="label">
				<span>Username or Email</span>
				<input
					class="input"
					type="text"
					placeholder="john_deo"
					autocomplete="username"
					bind:value={identifier}
					disabled={$login.isLoading}
				/>
			</label>
			<label class="label">
				<span>Password</span>
				<input
					class="input"
					type="password"
					placeholder="•••••••••••••"
					autocomplete="current-password"
					bind:value={password}
					disabled={$login.isLoading}
				/>
			</label>
			<button disabled={$login.isLoading} type="submit" class="btn variant-filled mt-2 w-full"
				>Continue</button
			>
			<p class="mt-2 text-center">
				<a href="/auth/register">Don't have an account? Create one.</a>
			</p>
			<p class="mt-2 text-center">
				<a href="/auth/forgot-password">Forgot password? Reset.</a>
			</p>
		</form>
	</section>
</div>
