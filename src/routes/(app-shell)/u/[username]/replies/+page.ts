import axios from 'axios'
import type { PageLoad } from './$types'
import type { GetUsersRepliesResponse } from '$lib/api/types'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const load: PageLoad = async ({ parent, url }) => {
	let page = +(url.searchParams.get('page') || 1)
	const { user, auth } = await parent()
	const { data } = await axios.get<GetUsersRepliesResponse>(
		`/user/${user.id}/replies?limit=20&page=${page}`,
		{ baseURL: PUBLIC_BASE_URL, headers: { Authorization: `Bearer ${auth?.accessToken}` } },
	)
	return {
		replies: data.replies,
		page,
	}
}
