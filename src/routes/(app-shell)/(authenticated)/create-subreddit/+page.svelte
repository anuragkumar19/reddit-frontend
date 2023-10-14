<script lang="ts">
	import { goto } from '$app/navigation'
	import { onError } from '$lib/api/common'
	import type { AxiosApiError, CreateSubredditBody, CreateSubredditResponse } from '$lib/api/types'
	import { createSubredditSchema } from '$lib/validations/zod'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation } from '@tanstack/svelte-query'
	import axios from 'axios'

	let name = ''

	const toastStore = getToastStore()

	export const createSubreddit = createMutation<
		CreateSubredditResponse,
		AxiosApiError,
		CreateSubredditBody
	>({
		mutationFn: (data) => axios.post<CreateSubredditResponse>('/r/', data).then((res) => res.data),
		onError: onError(toastStore),
		onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Subreddit created. Redirecting...',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})
			goto(`r/${variables.name}`)
		},
	})

	function handleSubmit() {
		const result = createSubredditSchema.safeParse({ name })

		if (!result.success) {
			toastStore.trigger({
				message: result.error.errors[0].message,
				background: 'variant-filled-warning',
				autohide: true,
				timeout: 4000,
			})
			return
		}

		$createSubreddit.mutate(result.data)
	}
</script>

<svelte:head>
	<title>Create community | Reddit</title>
</svelte:head>
<main class="flex justify-center">
	<div class="card w-full max-w-sm mt-8">
		<header class="card-header text-center">
			<h3 class="h3 mt-1">Start your community</h3>
			<p>Choose a identifier for your subreddit</p>
		</header>
		<section class="p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>r/{name}</span>
					<input
						class="input"
						type="text"
						bind:value={name}
						disabled={$createSubreddit.isLoading}
					/>
				</label>
				<button
					disabled={$createSubreddit.isLoading}
					type="submit"
					class="btn variant-filled-primary my-2 w-full"
				>
					Create
				</button>
			</form>
		</section>
	</div>
</main>
