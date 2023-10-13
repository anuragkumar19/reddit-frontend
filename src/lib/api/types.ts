import type { AxiosError } from 'axios'

export interface MessageResponse {
	message: string
}

export type AxiosApiError = AxiosError<MessageResponse>

export interface VerifyEmailBody {
	email: string
	otp: number
}

export interface RegisterBody {
	name: string
	email: string
	username: string
	password: string
}

export interface LoginBody {
	identifier: string
	password: string
}

export interface LoginResponse {
	token: string
}

export interface ForgotPasswordBody {
	email: string
}

export interface ResetPasswordBody {
	email: string
	otp: number
	password: string
}

export interface VoteBody {
	down: boolean
}

export interface CommentBody {
	content: string
}

interface Post {
	id: number
	title: string
	text: string
	image: string
	video: string
	link: string
	subreddit_id: number
	creator_id: number
	created_at: string
	creator_username: string
	creator_avatar: string
	creator_name: string
	subreddit_name: string
	subreddit_avatar: string
	subreddit_is_verified: boolean
	subreddit_title: string
	replies_count: number
	up_vote_count: number
	down_vote_count: number
	vote: number
}

export interface GetPostResponse {
	post: Post
}

interface Reply {
	id: number
	content: string
	parent_reply_id: {
		Int32: number
		Valid: boolean
	}
	post_id: {
		Int32: number
		Valid: boolean
	}
	creator_id: number
	created_at: string
	creator_username: string
	creator_avatar: string
	creator_name: string
	replies_count: number
	up_vote_count: number
	down_vote_count: number
	vote: number
}

export interface GetPostsRepliesResponse {
	replies: Reply[]
}

export interface GetReplyResponse {
	reply: Reply
}

export interface GetReplyRepliesResponse {
	replies: Reply[]
}

export interface CreateSubredditBody {
	name: string
}

export interface UpdateSubredditTitleBody {
	title: string
}

export interface AddTextPostToASubredditBody {
	title: string
	text: string
}

export interface AddPostResponse {
	id: number
}

export interface AddLinkPostToASubredditBody {
	title: string
	text: string
	link: string
}

interface Subreddit {
	id: number
	name: string
	about: string
	title: string
	avatar: string
	cover: string
	is_verified: boolean
	created_at: string
	creator_id: number
	member_count: number
	is_joined: boolean
}

export interface GetSubredditByIdResponse {
	subreddit: Subreddit
}

export interface GetSubredditByNameResponse {
	subreddit: Subreddit
}

interface SearchResultSubreddit {
	id: number
	name: string
	title: string
	avatar: string
	is_verified: boolean
	member_count: number
	is_joined: boolean
}

export interface SearchSubredditResponse {
	items: SearchResultSubreddit[]
}

export interface GetSubredditPostsResponse {
	posts: Post[]
}

export interface UserMeResponse {
	id: number
	name: string
	username: string
	avatar: string
	email: string
	is_email_verified: boolean
	created_at: string
	updated_at: string
}

export interface UpdateNameBody {
	name: string
}

export interface UpdateUsernameBody {
	username: string
}

export interface UpdatePasswordBody {
	old_password: string
	new_password: string
}

export interface UpdateAvatarBody {
	file: File
}

interface User {
	id: number
	name: string
	username: string
	avatar: string
	created_at: string
}

export interface GetUserByIdResponse {
	user: User
}

export interface GetUserByUsernameResponse {
	user: User
}

export interface GetUsersPostsResponse {
	posts: Post[]
}

export interface GetUsersRepliesResponse {
	replies: Reply[]
}

interface UserSearchResult {
	id: number
	name: string
	username: string
	avatar: string
}

export interface SearchUserResponse {
	users: UserSearchResult[]
}
