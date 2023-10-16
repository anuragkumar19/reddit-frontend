<script lang="ts">
	import type { GetReplyResponse } from '$lib/api/types'
	import { createEventDispatcher } from 'svelte'
	import Reply from './reply.svelte'

	const dispatch = createEventDispatcher()

	export let replies: GetReplyResponse['reply'][]
</script>

<div class="pl-4 border-l-2 border-gray-400">
	{#each replies as reply}
		<Reply {reply} on:delete={(e) => dispatch('delete', e.detail)} />
	{:else}
		<h3 class="h3">No replies</h3>
	{/each}
</div>
