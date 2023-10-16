<script lang="ts">
	import axios from 'axios'
	import '../app.postcss'
	import type { LayoutServerData } from './$types'
	import {
		Modal,
		Toast,
		getToastStore,
		initializeStores,
		type ModalComponent,
		ProgressBar,
	} from '@skeletonlabs/skeleton'
	import { PUBLIC_BASE_URL } from '$env/static/public'
	import { browser } from '$app/environment'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import SearchModal from './(app-shell)/search-modal.svelte'
	import { navigating } from '$app/stores'

	const modalRegistry: Record<string, ModalComponent> = {
		searchModal: { ref: SearchModal },
	}

	export let data: LayoutServerData

	initializeStores()

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
			},
		},
	})

	// axios.defaults.baseURL = 'http://localhost:5000/api';
	axios.defaults.headers.common.Authorization = `Bearer ${data.auth?.accessToken}`
	axios.defaults.baseURL = PUBLIC_BASE_URL
</script>

<Toast />
<Modal components={modalRegistry} />
{#if $navigating}
	<ProgressBar height="h-1" class="fixed top-0 z-50" rounded="rounded-none" />
{/if}
<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
