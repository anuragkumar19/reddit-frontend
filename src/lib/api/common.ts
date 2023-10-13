import { getToastStore } from '@skeletonlabs/skeleton'
import type { AxiosApiError } from './types'

const toastStore = getToastStore()

export function onError(err: AxiosApiError) {
	toastStore.trigger({
		message: err.response!.data.message,
		background: 'variant-filled-warning',
		autohide: true,
		timeout: 4000,
	})
}
