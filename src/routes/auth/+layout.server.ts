import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ parent }) => {
	const data = await parent()

	if (data.auth != null) {
		throw redirect(302, '/')
	}
}
