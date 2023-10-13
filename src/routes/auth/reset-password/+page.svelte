<script lang="ts">
	import { goto } from '$app/navigation'
	import { resetPassword } from '$lib/api/auth'
	import { forgotPasswordSchema, resetPasswordSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'

	const toastStore = getToastStore()

	let otp = ''
	let email = ''
	let password = ''

	onMount(() => {
		try {
			const emailStr = sessionStorage.getItem('forgot_password_email')

			if (!emailStr) {
				throw Error()
			}

			email = emailStr
			forgotPasswordSchema.parse({ email })
		} catch (err) {
			goto('/auth/forgot-password')
		}
	})

	async function handleSubmit() {
		const result = resetPasswordSchema.safeParse({ email, otp, password })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$resetPassword.mutate(result.data)
	}
</script>

<svelte:head>
	<title>Reset password | Reddit</title>
</svelte:head>
<div class="card w-full max-w-sm">
	<header class="card-header text-center">
		<img
			src="https://www.redditinc.com/assets/images/site/reddit-logo.png"
			alt="Reddit"
			class="w-14 mx-auto"
		/>
		<h2 class="h2 mt-1">Reddit</h2>
		<h3 class="h3 mt-4">Reset password</h3>
		<p>
			<code>{email}</code>
		</p>
	</header>
	<section class="p-4">
		<form on:submit|preventDefault={handleSubmit}>
			<label class="label">
				<span>OTP</span>
				<input
					class="input"
					type="text"
					placeholder="000000"
					autocomplete="off"
					bind:value={otp}
					disabled={$resetPassword.isLoading}
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
					disabled={$resetPassword.isLoading}
				/>
			</label>
			<button
				type="submit"
				class="btn variant-filled mt-2 w-full"
				disabled={$resetPassword.isLoading}>Continue</button
			>
			<p class="mt-2 text-center">
				<a href="/auth/forgot-password">Back {'>'}</a>
			</p>
		</form>
	</section>
</div>
