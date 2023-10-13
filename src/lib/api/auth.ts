import { createMutation } from '@tanstack/svelte-query'
import { onError } from './common'
import axios from 'axios'
import { getToastStore } from '@skeletonlabs/skeleton'
import { goto } from '$app/navigation'
import type {
	AxiosApiError,
	ForgotPasswordBody,
	LoginBody,
	LoginResponse,
	MessageResponse,
	RegisterBody,
	ResetPasswordBody,
	VerifyEmailBody,
} from './types'
import Cookies from 'js-cookie'

const toastStore = getToastStore()

export const register = createMutation<MessageResponse, AxiosApiError, RegisterBody>({
	mutationFn: (data) => axios.post<MessageResponse>('/auth/register', data).then((res) => res.data),
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'Registered. An OTP is sent to your email for verification',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})

		sessionStorage.setItem('register_data', JSON.stringify(variables))
		goto('/auth/verify-email')
	},
})

export const verifyEmail = createMutation<MessageResponse, AxiosApiError, VerifyEmailBody>({
	mutationFn: (data) =>
		axios.post<MessageResponse>('/auth/verify-email', data).then((res) => res.data),
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'Verified. Now you can login',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})

		sessionStorage.removeItem('register_data')
		goto('/auth/login')
	},
})

export const forgotPassword = createMutation<MessageResponse, AxiosApiError, ForgotPasswordBody>({
	mutationFn: (data) =>
		axios.post<MessageResponse>('/auth/forgot-password', data).then((res) => res.data),
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'An OTP is sent to your email.',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})

		sessionStorage.setItem('forgot_password_email', variables.email)
		goto('/auth/reset-password')
	},
})

export const resetPassword = createMutation<MessageResponse, AxiosApiError, ResetPasswordBody>({
	mutationFn: (data) =>
		axios.post<MessageResponse>('/auth/reset-password', data).then((res) => res.data),
	onError,
	onSuccess(_, variables) {
		toastStore.trigger({
			message: 'Password reset successful. Now you can login',
			background: 'variant-filled-success',
			autohide: true,
			timeout: 4000,
		})

		sessionStorage.removeItem('forgot_password_email')
		goto('/auth/login')
	},
})

export const login = createMutation<LoginResponse, AxiosApiError, LoginBody>({
	mutationFn: (data) => axios.post<LoginResponse>('/auth/login', data).then((res) => res.data),
	onError,
	onSuccess(data, variables) {
		Cookies.set('access_token', data.token, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		})
		window.location.href = '/'
	},
})
