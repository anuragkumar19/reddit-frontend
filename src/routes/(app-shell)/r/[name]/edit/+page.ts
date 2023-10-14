import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent }) => {
	const data = await parent()

	if (data.subreddit.creator_id !== data.auth?.user.id) {
		throw error(404, 'Page not found')
	}
}
