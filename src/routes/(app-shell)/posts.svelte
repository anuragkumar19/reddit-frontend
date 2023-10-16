<script lang="ts">
	import type { GetPostResponse } from '$lib/api/types'
	import { writable } from 'svelte/store'
	import Post from './post.svelte'

	export let posts: GetPostResponse['post'][]

	$: postsAlt = writable(posts)

	function deletePost(e: CustomEvent<number>) {
		postsAlt.update((posts) => posts.filter((p) => p.id !== e.detail))
	}
</script>

{#each $postsAlt as post}
	<Post {post} on:delete={deletePost} />
{:else}
	<h3 class="h3">No posts</h3>
{/each}
