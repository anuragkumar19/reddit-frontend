import { z } from 'zod'

const zodString = (field: string, nonempty: boolean = false) => {
	let str = z.string({
		invalid_type_error: `${field} is invalid.`,
		required_error: `${field} is required.`,
	})

	if (nonempty) str = str.min(1, `${field} cannot be empty.`)
	return str
}

const name = zodString('Name', true)
	.trim()
	.min(3, { message: 'Name must be at least 3 character long' })
	.max(30, { message: 'Name cannot exceed 30 character' })

const email = zodString('Email').trim().toLowerCase().email({ message: 'Invalid email' })

const username = zodString('Username')
	.trim()
	.toLowerCase()
	.min(3, { message: 'Username must be at least 3 character long' })
	.max(30, { message: 'Username cannot exceed 30 character' })
	.regex(/^[a-zA-Z0-9]+$/i, 'Username must contain only letters, numbers')
	.refine((arg) => /[a-zA-Z]/.test(arg.charAt(0)), {
		message: 'Username cannot start with number',
	})

const password = zodString('Password')
	.min(8, { message: 'Password must be at least 8 character long' })
	.max(60, { message: 'Password cannot exceed 60 character' })

const otp = z
	.number({
		coerce: true,
		invalid_type_error: 'OTP must be number',
		required_error: 'OTP is required',
	})
	.min(100000, { message: 'Invalid OTP' })
	.max(999999, { message: 'Invalid OTP' })

export const registerSchema = z.object({
	name,
	email,
	username,
	password,
})
export type RegisterSchema = z.infer<typeof registerSchema>

export const verifyEmailSchema = z.object({
	email,
	otp,
})
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
	email,
})
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
	email,
	otp,
	password,
})
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export const loginSchema = z.object({
	identifier: email.or(username),
	password,
})
export type LoginSchema = z.infer<typeof loginSchema>

export const updateNameSchema = z.object({
	name,
})
export type UpdateNameSchema = z.infer<typeof updateNameSchema>

export const updateUsernameSchema = z.object({
	username,
})
export type UpdateUsernameSchema = z.infer<typeof updateUsernameSchema>

export const updatePasswordSchema = z.object({
	old_password: password,
	new_password: password,
})
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>