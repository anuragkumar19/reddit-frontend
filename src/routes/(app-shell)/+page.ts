import axios from 'axios'
import type { PageLoad } from './$types'
import type { GetFeedPostsResponse, GetTrendingPostsResponse } from '$lib/api/types'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const load: PageLoad = async ({ parent, url }) => {
	let page = +(url.searchParams.get('page') || 1)

	const { auth } = await parent()

	let posts: GetFeedPostsResponse['posts']
	if (auth) {
		const { data } = await axios.get<GetFeedPostsResponse>(`/feed/?limit=15&page=${page}`, {
			baseURL: PUBLIC_BASE_URL,
			headers: { Authorization: `Bearer ${auth.accessToken}` },
		})
		posts = data.posts
	} else {
		const { data } = await axios.get<GetTrendingPostsResponse>(`/feed/posts/trending`, {
			baseURL: PUBLIC_BASE_URL,
		})
		posts = data.posts
	}

	return {
		posts,
		page,
	}
}
