import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import type { UserMeResponse } from '$lib/api/types'

export const load: LayoutServerLoad = async ({
	parent,
}): Promise<{ auth: { accessToken: string; user: UserMeResponse } }> => {
	const data = await parent()

	if (data.auth === null) {
		throw redirect(302, '/auth/login')
	}

	return {
		auth: data.auth,
	}
}
