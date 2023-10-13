<script lang="ts">
	import type { PageData } from './$types'
	import PopularPosts from './popular-posts.svelte'
	import Feed from './feed.svelte'
	export let data: PageData

	console.log(data)
</script>

<main class="mt-4">
	{#if data.auth == null}
		<PopularPosts />
	{:else}
		<Feed />
	{/if}
</main>
