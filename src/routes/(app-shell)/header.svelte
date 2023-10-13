<script lang="ts">
	import type { UserMeResponse } from '$lib/api/types'
	export let auth: { accessToken: string; user: UserMeResponse } | null
	import { AppBar, Avatar, LightSwitch } from '@skeletonlabs/skeleton'
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<a class="flex gap-2 items-center" href="/">
			<img
				src="https://www.redditinc.com/assets/images/site/reddit-logo.png"
				alt="Reddit"
				class="w-8"
			/>
			<span>Reddit</span>
		</a>
	</svelte:fragment>
	<div>
		<input type="text" class="input" placeholder="Search reddit" />
	</div>
	<svelte:fragment slot="trail">
		<div class="flex gap-2 items-center">
			{#if auth == null}
				<a href="/auth/login" class="btn btn-sm variant-filled-secondary">Login</a>
				<a href="/auth/register" class="btn btn-sm variant-filled-primary">Signup</a>
			{:else}
				<a href={`/u/${auth.user.username}`}
					><Avatar
						src={auth.user.avatar}
						width="w-8"
						rounded="rounded-full"
						border="border-2 hover:!border-primary-500"
						cursor="cursor-pointer"
					/></a
				>
			{/if}
			<LightSwitch />
		</div>
	</svelte:fragment>
</AppBar>
