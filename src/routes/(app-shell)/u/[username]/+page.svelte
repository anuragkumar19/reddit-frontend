<script lang="ts">
	import { goto } from '$app/navigation'
	import Posts from '../../posts.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: posts = data.posts
	// $: user = data.user
</script>

<section class="my-4">
	<h4 class="h4">Posts</h4>
	<Posts {posts} />
	<div class="mt-4">
		{#if data.page > 1}
			<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page - 1}`)}
				>Previous</button
			>
		{/if}
		{#if posts.length === 10}
			<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page + 1}`)}
				>Next</button
			>
		{/if}
	</div>
</section>
