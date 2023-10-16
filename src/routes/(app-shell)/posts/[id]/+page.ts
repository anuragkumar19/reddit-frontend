import { PUBLIC_BASE_URL } from '$env/static/public'
import type { GetPostResponse, GetPostsRepliesResponse } from '$lib/api/types'
import axios from 'axios'
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ parent, url, params }) => {
	let page = +(url.searchParams.get('page') || 1)

	const { auth } = await parent()

	const res1 = await axios
		.get<GetPostResponse>(`/posts/${params.id}`, {
			baseURL: PUBLIC_BASE_URL,
			headers: { Authorization: `Bearer ${auth?.accessToken}` },
		})
		.catch(() => {
			throw error(404, 'Post not found')
		})

	const res2 = await axios.get<GetPostsRepliesResponse>(
		`/posts/${params.id}/replies?limit=20&page=${page}`,
		{
			baseURL: PUBLIC_BASE_URL,
			headers: { Authorization: `Bearer ${auth?.accessToken}` },
		},
	)

	return {
		post: res1.data.post,
		replies: res2.data.replies,
		page,
	}
}
