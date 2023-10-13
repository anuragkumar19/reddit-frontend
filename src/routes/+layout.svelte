<script lang="ts">
	import axios from 'axios'
	import '../app.postcss'
	import type { LayoutServerData } from './$types'
	import { Toast, getToastStore, initializeStores } from '@skeletonlabs/skeleton'
	import { PUBLIC_BASE_URL } from '$env/static/public'
	import { browser } from '$app/environment'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

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
<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
