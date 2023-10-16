import axios from 'axios'
import type { PageLoad } from './$types'
import type { GetSubredditPostsResponse } from '$lib/api/types'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const load: PageLoad = async ({ parent, url }) => {
	let page = +(url.searchParams.get('page') || 1)
	const { subreddit, auth } = await parent()
	const { data } = await axios.get<GetSubredditPostsResponse>(
		`/r/${subreddit.id}/posts?limit=10&page=${page}`,
		{ baseURL: PUBLIC_BASE_URL, headers: { Authorization: `Bearer ${auth?.accessToken}` } },
	)
	return {
		posts: data.posts,
		page,
	}
}
