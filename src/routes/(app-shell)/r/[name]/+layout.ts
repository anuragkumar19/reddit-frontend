import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'
import axios from 'axios'
import type { GetSubredditByNameResponse } from '$lib/api/types'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const load: LayoutLoad = async (event) => {
	const parentData = await event.parent()
	const name = event.params['name']

	try {
		const { data } = await axios.get<GetSubredditByNameResponse>(`r/name/${name}`, {
			baseURL: PUBLIC_BASE_URL,
			headers: {
				Authorization: `Bearer ${parentData.auth?.accessToken}`,
			},
		})

		return data
	} catch (err) {
		console.log(err)

		throw error(404, 'Subreddit not found')
	}
}
