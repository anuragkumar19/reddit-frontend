<script lang="ts">
	import { login } from '$lib/api/auth'
	import { loginSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'

	const toastStore = getToastStore()

	let identifier = ''
	let password = ''

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
