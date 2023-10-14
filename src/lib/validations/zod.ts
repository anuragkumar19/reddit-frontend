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

export const createSubredditSchema = z.object({
	name: username,
})
export type CreateSubredditSchema = z.infer<typeof createSubredditSchema>

export const updateSubredditTitleSchema = z.object({
	title: zodString('Title', false)
		.trim()
		.max(30, { message: 'Title must not be greater than 30 characters' }),
})
export type UpdateSubredditTitleSchema = z.infer<typeof updateSubredditTitleSchema>

export const updateSubredditAboutSchema = z.object({
	about: zodString('About', false)
		.trim()
		.max(500, { message: 'About must not be greater than 500 characters' }),
})
export type UpdateSubredditAboutSchema = z.infer<typeof updateSubredditAboutSchema>

export const createTextPostSchema = z.object({
	title: zodString('Title', true).trim().max(50),
	text: zodString('Text', true).trim().max(2000),
})
export type CreateTextPostSchema = z.infer<typeof createTextPostSchema>

export const createLinkPostSchema = z.object({
	title: zodString('Title', true)
		.trim()
		.max(50, { message: 'Title must be not longer than 50 characters' }),
	text: zodString('Text', true)
		.trim()
		.max(2000, { message: 'Text must not be longer than 2000 characters' }),
	link: zodString('Link', true).url({ message: 'Link must be valid url' }),
})

export type CreateLinkPostSchema = z.infer<typeof createLinkPostSchema>

export const createMediaPostSchema = z.object({
	title: zodString('Title', true)
		.trim()
		.max(50, { message: 'Title must be not longer than 50 characters' }),
	text: zodString('Text', false)
		.trim()
		.max(2000, { message: 'Text must not be longer than 2000 characters' }),
})
export type CreateMediaPostSchema = z.infer<typeof createMediaPostSchema>
