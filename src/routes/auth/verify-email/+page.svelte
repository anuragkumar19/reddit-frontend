<script lang="ts">
	import { goto } from '$app/navigation'
	import { verifyEmail } from '$lib/api/auth'
	import { registerSchema, verifyEmailSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'

	const toastStore = getToastStore()

	let otp = ''
	let name = ''
	let username = ''
	let email = ''
	let password = ''

	onMount(() => {
		try {
			const dataStr = sessionStorage.getItem('register_data')

			if (!dataStr) {
				throw Error()
			}

			const data = registerSchema.parse(JSON.parse(dataStr))

			name = data.name
			username = data.username
			email = data.email
			password = data.password
		} catch (err) {
			goto('/auth/register')
		}
	})

	async function handleSubmit() {
		const result = verifyEmailSchema.safeParse({ email, otp })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$verifyEmail.mutate(result.data)
	}
</script>

<svelte:head>
	<title>Verify Email | Reddit</title>
</svelte:head>
<div class="card w-full max-w-sm">
	<header class="card-header text-center">
		<img
			src="https://www.redditinc.com/assets/images/site/reddit-logo.png"
			alt="Reddit"
			class="w-14 mx-auto"
		/>
		<h2 class="h2 mt-1">Reddit</h2>
		<h3 class="h3 mt-4">Verify Your Email</h3>
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
					disabled={$verifyEmail.isLoading}
				/>
			</label>
			<button type="submit" class="btn variant-filled mt-2 w-full" disabled={$verifyEmail.isLoading}
				>Continue</button
			>
			<p class="mt-2 text-center">
				<a href="/auth/register">Back {'>'}</a>
			</p>
		</form>
	</section>
</div>
