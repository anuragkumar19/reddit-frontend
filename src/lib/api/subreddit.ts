import { createMutation } from '@tanstack/svelte-query'
import axios from 'axios'
import { onError } from './common'
import type { MessageResponse, AxiosApiError, UpdateAvatarBody } from './types'
import { getToastStore } from '@skeletonlabs/skeleton'

const toastStore = getToastStore()

// export const updateAvatar = createMutation<MessageResponse, AxiosApiError, UpdateAvatarBody>({
// 	mutationFn: (data) => {
// 		const formData = new FormData()
// 		formData.append('file', data.file)
// 		return axios.put<MessageResponse>('/user/avatar', formData).then((res) => res.data)
// 	},
// 	onError,
// 	onSuccess(_, variables) {
// 		toastStore.trigger({
// 			message: 'Avatar updated',
// 			background: 'variant-filled-success',
// 			autohide: true,
// 			timeout: 4000,
// 		})
// 	},
// })
