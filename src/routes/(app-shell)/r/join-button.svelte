<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { onError } from '$lib/api/common'
	import type { AxiosApiError, MessageResponse, UserMeResponse } from '$lib/api/types'
	import { getToastStore } from '@skeletonlabs/skeleton'
	import { createMutation, useQueryClient } from '@tanstack/svelte-query'
	import axios from 'axios'

	export let subreddit: { id: number; is_joined: boolean; name: string }

	const toastStore = getToastStore()
	const queryClient = useQueryClient()

	const join = createMutation<MessageResponse, AxiosApiError>({
		mutationFn: () =>
			axios.post<MessageResponse>(`/r/${subreddit.id}/join`).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Joined',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await invalidateAll()
			await queryClient.invalidateQueries({ queryKey: [`r/${subreddit.id}`] })
			await queryClient.invalidateQueries({ queryKey: ['top-subreddit'] })
		},
	})

	const leave = createMutation<MessageResponse, AxiosApiError>({
		mutationFn: () =>
			axios.post<MessageResponse>(`/r/${subreddit.id}/leave`).then((res) => res.data),
		onError: onError(toastStore),
		async onSuccess(_, variables) {
			toastStore.trigger({
				message: 'Left',
				background: 'variant-filled-success',
				autohide: true,
				timeout: 4000,
			})

			await invalidateAll()
			await queryClient.invalidateQueries({ queryKey: [`r/${subreddit.id}`] })
			await queryClient.invalidateQueries({ queryKey: ['top-subreddit'] })
		},
	})

	$: loading = $join.isLoading || $leave.isLoading
</script>

{#if subreddit.is_joined}
	<button
		disabled={loading}
		class="btn variant-filled-secondary btn-sm"
		on:click={() => (confirm('Are you sure you wanna leave subreddit?') ? $leave.mutate() : '')}
		>Joined</button
	>
{:else}
	<button
		disabled={loading}
		class="btn variant-filled-primary btn-sm"
		on:click={() =>
			$page.data.auth ? $join.mutate() : goto(`/auth/login?redirect=${window.location.pathname}`)}
		>Join</button
	>
{/if}
