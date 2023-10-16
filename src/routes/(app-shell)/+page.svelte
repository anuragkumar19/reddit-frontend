<script lang="ts">
	import type { PageData } from './$types'
	import Posts from './posts.svelte'
	import { goto } from '$app/navigation'
	export let data: PageData

	$: posts = data.posts
</script>

<svelte:head>
	<title>Reddit</title>
</svelte:head>
<main class="mt-4">
	<section class="my-4">
		<Posts {posts} />
		<div class="mt-4">
			{#if data.page > 1}
				<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page - 1}`)}
					>Previous</button
				>
			{/if}
			{#if posts.length === 15}
				<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page + 1}`)}
					>Next</button
				>
			{/if}
		</div>
	</section>
</main>
