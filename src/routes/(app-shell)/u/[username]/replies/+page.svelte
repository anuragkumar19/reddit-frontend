<script lang="ts">
	import { goto } from '$app/navigation'
	import Replies from '../../../replies.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: replies = data.replies
	// $: user = data.user
</script>

<section class="my-4">
	<h4 class="h4">Replies</h4>
	<Replies {replies} />
	<div class="mt-4">
		{#if data.page > 1}
			<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page - 1}`)}
				>Previous</button
			>
		{/if}
		{#if replies.length === 20}
			<button class="btn variant-outline-primary" on:click={() => goto(`?page=${data.page + 1}`)}
				>Next</button
			>
		{/if}
	</div>
</section>
