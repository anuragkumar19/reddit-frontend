<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'

	const modalStore = getModalStore()

	function showCreateSubredditModal() {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Create community',
			body: 'Provide identifier for your subreddit',
			value: 'r/',
			valueAttr: { type: 'text' },
			response: async (r: string) => {
				if (r.startsWith('r/')) {
					r = r.replace('r/', '')
				}
			},
		}
		modalStore.trigger(modal)
	}
</script>

<div class="w-0 hidden md:w-60 md:block px-4 h-screen">
	<h3 class="h3 mt-4">Top 10 subreddit</h3>
	<a href="/create-subreddit" class="btn btn-lg w-full variant-filled-primary mt-4">
		Create Community
	</a>
</div>
