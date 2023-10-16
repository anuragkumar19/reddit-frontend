<script lang="ts">
	import type { SearchUserResponse } from '$lib/api/types'
	import { Avatar } from '@skeletonlabs/skeleton'

	export let users: SearchUserResponse['users']
</script>

<ul class="list">
	{#each users as user}
		<li>
			<span><Avatar src={user.avatar} width="w-10" /></span>
			<span class="flex-auto"><a href="/u/{user.username}">u/{user.username}</a></span>
		</li>
	{/each}
</ul>
