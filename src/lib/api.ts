// NOTE: IT WAS A SOURCE TO GENERATE TYPES KEEPING IT JUST IN CASE

/* import axios from 'axios'
import type { MessageResponse, RegisterBody, VerifyEmailBody } from './api/types'

export const AuthRegister = (data: RegisterBody) =>
	axios.post<MessageResponse>('/auth/register', data)

export const AuthVerifyEmail = (data: VerifyEmailBody) =>
	axios.post<MessageResponse>('/auth/verify-email', data)

//Request types
type AuthLoginRequestBody = { identifier: string; password: string }

//Response types
type AuthLoginResponseBody = { token: string }

export const AuthLogin = (data: AuthLoginRequestBody) =>
	axios.post<AuthLoginResponseBody>('/auth/login', data)

//Request types
type AuthForgotPasswordRequestBody = { email: string }

//Response types
type AuthForgotPasswordResponseBody = { message: string }

export const AuthForgotPassword = (data: AuthForgotPasswordRequestBody) =>
	axios.post<AuthForgotPasswordResponseBody>('/auth/forgot-password', data)

//Request types
type AuthResetPasswordRequestBody = { email: string; otp: number; password: string }

//Response types
type AuthResetPasswordResponseBody = { message: string }

export const AuthResetPassword = (data: AuthResetPasswordRequestBody) =>
	axios.post<AuthResetPasswordResponseBody>('/auth/reset-password', data)

//Request types
type PostsUpvotePostRequestBody = { down: boolean }

//Response types
type PostsUpvotePostResponseBody = { down: boolean }

export const PostsUpvotePost = (data: PostsUpvotePostRequestBody) =>
	axios.post<PostsUpvotePostResponseBody>('/posts/:id/vote', data)

//Request types
type PostsDownvotePostRequestBody = { down: boolean }

//Response types
type PostsDownvotePostResponseBody = { down: boolean }

export const PostsDownvotePost = (data: PostsDownvotePostRequestBody) =>
	axios.post<PostsDownvotePostResponseBody>('/posts/:id/vote', data)

//Response types
type PostsRemoveVoteFromPostResponseBody = { message: string }

export const PostsRemoveVoteFromPost = () =>
	axios.delete<PostsRemoveVoteFromPostResponseBody>('/posts/:id/vote')

//Request types
type PostsCommentOnPostRequestBody = { content: string }

//Response types
type PostsCommentOnPostResponseBody = { id: number }

export const PostsCommentOnPost = (data: PostsCommentOnPostRequestBody) =>
	axios.post<PostsCommentOnPostResponseBody>('/posts/:id/reply', data)

//Response types
type PostsGetPostResponseBody = {
	post: {
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
}

export const PostsGetPost = () => axios.get<PostsGetPostResponseBody>('/posts/:id')

//Response types
type PostsGetPostsRepliesResponseBody = {
	replies: {
		id: number
		content: string
		parent_reply_id: { Int32: number; Valid: boolean }
		post_id: { Int32: number; Valid: boolean }
		creator_id: number
		created_at: string
		creator_username: string
		creator_avatar: string
		creator_name: string
		replies_count: number
		up_vote_count: number
		down_vote_count: number
		vote: number
	}[]
}

export const PostsGetPostsReplies = () =>
	axios.get<PostsGetPostsRepliesResponseBody>('/posts/:id/replies')

//Response types
type PostsDeletePostResponseBody = { message: string }

export const PostsDeletePost = () => axios.delete<PostsDeletePostResponseBody>('/posts/:id')

//Request types
type RepliesUpvoteReplyRequestBody = { down: boolean }

//Response types
type RepliesUpvoteReplyResponseBody = { down: boolean }

export const RepliesUpvoteReply = (data: RepliesUpvoteReplyRequestBody) =>
	axios.post<RepliesUpvoteReplyResponseBody>('/replies/:id/vote', data)

//Request types
type RepliesDownvoteReplyRequestBody = { down: boolean }

//Response types
type RepliesDownvoteReplyResponseBody = { down: boolean }

export const RepliesDownvoteReply = (data: RepliesDownvoteReplyRequestBody) =>
	axios.post<RepliesDownvoteReplyResponseBody>('/replies/:id/vote', data)

//Response types
type RepliesDeleteVoteReplyResponseBody = { message: string }

export const RepliesDeleteVoteReply = () =>
	axios.delete<RepliesDeleteVoteReplyResponseBody>('/replies/:id/vote')

//Request types
type RepliesReplyToReplyRequestBody = { content: string }

//Response types
type RepliesReplyToReplyResponseBody = { id: number }

export const RepliesReplyToReply = (data: RepliesReplyToReplyRequestBody) =>
	axios.post<RepliesReplyToReplyResponseBody>('/replies/:id/reply', data)

//Response types
type RepliesGetReplyResponseBody = {
	reply: {
		id: number
		content: string
		parent_reply_id: { Int32: number; Valid: boolean }
		post_id: { Int32: number; Valid: boolean }
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
}

export const RepliesGetReply = () => axios.get<RepliesGetReplyResponseBody>('/replies/:id')

//Response types
type RepliesGetReplysRepliesResponseBody = {
	replies: {
		id: number
		content: string
		parent_reply_id: { Int32: number; Valid: boolean }
		post_id: { Int32: number; Valid: boolean }
		creator_id: number
		created_at: string
		creator_username: string
		creator_avatar: string
		creator_name: string
		replies_count: number
		up_vote_count: number
		down_vote_count: number
		vote: number
	}[]
}

export const RepliesGetReplysReplies = () =>
	axios.get<RepliesGetReplysRepliesResponseBody>('/replies/:id/replies')

//Response types
type RepliesDeleteReplyResponseBody = { message: string }

export const RepliesDeleteReply = () => axios.delete<RepliesDeleteReplyResponseBody>('/replies/:id')

//Request types
type SubredditCreateSubredditRequestBody = { name: string }

//Response types
type SubredditCreateSubredditResponseBody = { id: number }

export const SubredditCreateSubreddit = (data: SubredditCreateSubredditRequestBody) =>
	axios.post<SubredditCreateSubredditResponseBody>('/r', data)

//Request types
type SubredditUpdateSubredditTitleRequestBody = { title: string }

//Response types
type SubredditUpdateSubredditTitleResponseBody = { message: string }

export const SubredditUpdateSubredditTitle = (data: SubredditUpdateSubredditTitleRequestBody) =>
	axios.put<SubredditUpdateSubredditTitleResponseBody>('/r/:id/title', data)

//Response types
type SubredditUpdateSubredditAvatarResponseBody = { message: string }

export const SubredditUpdateSubredditAvatar = () =>
	axios.put<SubredditUpdateSubredditAvatarResponseBody>('/r/:id/avatar')

//Response types
type SubredditUpdateSubredditCoverResponseBody = { message: string }

export const SubredditUpdateSubredditCover = () =>
	axios.put<SubredditUpdateSubredditCoverResponseBody>('/r/:id/cover')

//Response types
type SubredditJoinSubredditResponseBody = { message: string }

export const SubredditJoinSubreddit = () =>
	axios.post<SubredditJoinSubredditResponseBody>('/r/:id/join')

//Response types
type SubredditLeaveSubredditResponseBody = { message: string }

export const SubredditLeaveSubreddit = () =>
	axios.post<SubredditLeaveSubredditResponseBody>('/r/:id/leave')

//Request types
type SubredditAddTextPostToASubredditRequestBody = { title: string; text: string }

//Response types
type SubredditAddTextPostToASubredditResponseBody = { id: number }

export const SubredditAddTextPostToASubreddit = (
	data: SubredditAddTextPostToASubredditRequestBody,
) => axios.post<SubredditAddTextPostToASubredditResponseBody>('/r/:id/posts/text', data)

//Response types
type SubredditAddImagePostToASubredditResponseBody = { id: number }

export const SubredditAddImagePostToASubreddit = () =>
	axios.post<SubredditAddImagePostToASubredditResponseBody>('/r/:id/posts/image')

//Response types
type SubredditAddVideoPostToASubredditResponseBody = { id: number }

export const SubredditAddVideoPostToASubreddit = () =>
	axios.post<SubredditAddVideoPostToASubredditResponseBody>('/r/:id/posts/video')

//Request types
type SubredditAddLinkPostToASubredditRequestBody = { title: string; text: string; link: string }

//Response types
type SubredditAddLinkPostToASubredditResponseBody = { id: number }

export const SubredditAddLinkPostToASubreddit = (
	data: SubredditAddLinkPostToASubredditRequestBody,
) => axios.post<SubredditAddLinkPostToASubredditResponseBody>('/r/:id/posts/link', data)

//Response types
type SubredditGetSubredditByIdResponseBody = {
	subreddit: {
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
}

export const SubredditGetSubredditById = () =>
	axios.get<SubredditGetSubredditByIdResponseBody>('/r/:id')

//Response types
type SubredditGetSubredditByNameResponseBody = {
	subreddit: {
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
}

export const SubredditGetSubredditByName = () =>
	axios.get<SubredditGetSubredditByNameResponseBody>('/r/name/:name')

//Response types
type SubredditSearchSubredditResponseBody = {
	items: {
		id: number
		name: string
		title: string
		avatar: string
		is_verified: boolean
		member_count: number
		is_joined: boolean
	}[]
}

export const SubredditSearchSubreddit = () =>
	axios.get<SubredditSearchSubredditResponseBody>('/r/search?q=sssssss')

//Response types
type SubredditGetSubredditsPostsResponseBody = {
	posts: {
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
	}[]
}

export const SubredditGetSubredditsPosts = () =>
	axios.get<SubredditGetSubredditsPostsResponseBody>('/r/:id/posts')

//Response types
type SubredditDeleteSubredditResponseBody = { message: string }

export const SubredditDeleteSubreddit = () =>
	axios.delete<SubredditDeleteSubredditResponseBody>('/r/:id')

//Response types
export type UserMeResponseBody = {
	id: number
	name: string
	username: string
	avatar: string
	email: string
	is_email_verified: boolean
	created_at: string
	updated_at: string
}

export const UserMe = () => axios.get<UserMeResponseBody>('/user/me')

//Request types
type UserUpdateNameRequestBody = { name: string }

//Response types
type UserUpdateNameResponseBody = { message: string }

export const UserUpdateName = (data: UserUpdateNameRequestBody) =>
	axios.put<UserUpdateNameResponseBody>('/user/name', data)

//Request types
type UserUpdateUsernameRequestBody = { username: string }

//Response types
type UserUpdateUsernameResponseBody = { message: string }

export const UserUpdateUsername = (data: UserUpdateUsernameRequestBody) =>
	axios.put<UserUpdateUsernameResponseBody>('/user/username', data)

//Request types
type UserUpdatePasswordRequestBody = { old_password: string; new_password: string }

//Response types
type UserUpdatePasswordResponseBody = { message: string }

export const UserUpdatePassword = (data: UserUpdatePasswordRequestBody) =>
	axios.put<UserUpdatePasswordResponseBody>('/user/password', data)

//Response types
type UserUpdateAvatarResponseBody = { message: string }

export const UserUpdateAvatar = () => axios.put<UserUpdateAvatarResponseBody>('/user/avatar')

//Response types
type UserGetUserByIdResponseBody = {
	user: { id: number; name: string; username: string; avatar: string; created_at: string }
}

export const UserGetUserById = () => axios.get<UserGetUserByIdResponseBody>('/user/:id')

//Response types
type UserGetUserByUsernameResponseBody = {
	user: { id: number; name: string; username: string; avatar: string; created_at: string }
}

export const UserGetUserByUsername = () =>
	axios.get<UserGetUserByUsernameResponseBody>('/user/username/:username')

//Response types
type UserGetUsersPostsResponseBody = {
	posts: {
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
	}[]
}

export const UserGetUsersPosts = () => axios.get<UserGetUsersPostsResponseBody>('/user/:id/posts')

//Response types
type UserGetUsersRepliesResponseBody = {
	replies: {
		id: number
		content: string
		parent_reply_id: { Int32: number; Valid: boolean }
		post_id: { Int32: number; Valid: boolean }
		creator_id: number
		created_at: string
		creator_username: string
		creator_avatar: string
		creator_name: string
		replies_count: number
		up_vote_count: number
		down_vote_count: number
		vote: number
	}[]
}

export const UserGetUsersReplies = () =>
	axios.get<UserGetUsersRepliesResponseBody>('/user/:id/replies')

//Response types
type UserSearchUserResponseBody = {
	users: { id: number; name: string; username: string; avatar: string }[]
}

export const UserSearchUser = () => axios.get<UserSearchUserResponseBody>('/user/search?q=New')
 */
