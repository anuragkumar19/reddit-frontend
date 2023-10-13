import type { LayoutServerLoad } from './$types'
import type { UserMeResponse } from '$lib/api/types'
import { PUBLIC_BASE_URL } from '$env/static/public'
import axios from 'axios'

export const load: LayoutServerLoad = async ({
	cookies,
}): Promise<{ auth: { accessToken: string; user: UserMeResponse } | null }> => {
	const accessToken = cookies.get('access_token')

	if (!accessToken) {
		return {
			auth: null,
		}
	}

	let user: UserMeResponse
	try {
		axios.defaults.baseURL = PUBLIC_BASE_URL
		axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
		const { data } = await axios.get<UserMeResponse>('/user/me')

		user = data
	} catch (err) {
		return {
			auth: null,
		}
	}

	return {
		auth: {
			accessToken,
			user,
		},
	}
}
