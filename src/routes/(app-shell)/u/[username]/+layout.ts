import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'
import axios from 'axios'
import type { GetUserByUsernameResponse } from '$lib/api/types'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const load: LayoutLoad = async (event) => {
	const parentData = await event.parent()
	const username = event.params['username']

	try {
		const { data } = await axios.get<GetUserByUsernameResponse>(`/user/username/${username}`, {
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
