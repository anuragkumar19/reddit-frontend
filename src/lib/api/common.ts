import type { ToastStore } from '@skeletonlabs/skeleton'
import type { AxiosApiError } from './types'

export function onError(toastStore: ToastStore) {
	return function (err: AxiosApiError) {
		toastStore.trigger({
			message: err.response!.data.message,
			background: 'variant-filled-warning',
			autohide: true,
			timeout: 4000,
		})
	}
}
