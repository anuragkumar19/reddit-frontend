import { getToastStore } from '@skeletonlabs/skeleton'
import { createMutation } from '@tanstack/svelte-query'
import axios from 'axios'
import { onError } from './common'
import type {
	AxiosApiError,
	MessageResponse,
	UpdateAvatarBody,
	UpdateNameBody,
	UpdatePasswordBody,
	UpdateUsernameBody,
} from './types'

const toastStore = getToastStore()

export const updateName = createMutation<MessageResponse, AxiosApiError, UpdateNameBody>({
	mutationFn: (data) => axios.put<MessageResponse>('/user/name', data).then((res) => res.data),
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'Name updated',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})
	},
})

export const updateUsername = createMutation<MessageResponse, AxiosApiError, UpdateUsernameBody>({
	mutationFn: (data) => axios.put<MessageResponse>('/user/username', data).then((res) => res.data),
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'Username updated',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})
	},
})

export const updatePassword = createMutation<MessageResponse, AxiosApiError, UpdatePasswordBody>({
	mutationFn: (data) => axios.put<MessageResponse>('/user/password', data).then((res) => res.data),
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'Password updated',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})
	},
})

export const updateAvatar = createMutation<MessageResponse, AxiosApiError, UpdateAvatarBody>({
	mutationFn: (data) => {
		const formData = new FormData()
		formData.append('file', data.file)
		return axios.put<MessageResponse>('/user/avatar', formData).then((res) => res.data)
	},
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'Avatar updated',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})
	},
})
