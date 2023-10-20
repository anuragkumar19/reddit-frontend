<script lang="ts">
	import type {
		AxiosApiError,
		SearchSubredditResponse,
		SearchUserResponse,
		UserMeResponse,
	} from '$lib/api/types'
	import { createInfiniteQuery } from '@tanstack/svelte-query'
	import SubredditList from './subreddit-list.svelte'
	import UserList from './user-list.svelte'
	import { getModalStore } from '@skeletonlabs/skeleton'
	import axios, { Axios } from 'axios'
	import { onNavigate } from '$app/navigation'

	const modalStore = getModalStore()

	export let parent: any

	onNavigate(() => {
		parent.onClose()
	})

	let q = ''

	const cBase = 'card p-4 w-modal shadow-xl space-y-4'
	const cHeader = 'text-2xl font-bold'

	let users: SearchUserResponse['users'] = []
	let items: SearchSubredditResponse['items'] = []

	let timeout: number | undefined
	let controller: AbortController | undefined

	// TODO: Pagination
	function search(q: string) {
		clearTimeout(timeout)
		controller?.abort()
		if (q.startsWith('r/')) {
			let query = q
			query = q.replace('r/', '')
			if (query === '') {
				items = []
				return
			}

			timeout = window.setTimeout(async () => {
				controller = new AbortController()
				const data = await axios
					.get<SearchSubredditResponse>(`/r/search?q=${query}&limit=50&page=1`, {
						signal: controller.signal,
					})
					.then((res) => res.data)
				items = data.items
			}, 1000)
		} else {
			items = []
		}

		if (q.startsWith('u/')) {
			let query = q
			query = q.replace('u/', '')
			console.log(query)

			if (query === '') {
				users = []
				return
			}

			timeout = window.setTimeout(async () => {
				controller = new AbortController()
				const data = await axios
					.get<SearchUserResponse>(`/user/search?q=${query}&limit=5&page=1`, {
						signal: controller.signal,
					})
					.then((res) => res.data)
				users = data.users
			}, 1000)
		} else {
			users = []
		}
	}

	$: {
		search(q)
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Search Subreddit</header>
		<article>Start with r/ to search for subreddit and u/ to search for user.</article>
		<input type="text" class="input" placeholder="Start typing" bind:value={q} />
		{#if users.length > 0}
			<h3 class="h3">Users</h3>
			<UserList {users} />
		{/if}
		{#if items.length > 0}
			<h3 class="h3">Subreddit</h3>
			<SubredditList {items} joinButton={false} />
		{/if}
	</div>
{/if}
