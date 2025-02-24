export type Forum = {
	id: string,
	name: string,
	created_at: string
}

export type ForumOptions = Omit<Forum, "id" | "created_at">

export type Post = {
	id: string,
	forum_id: string,
	poster_id: string
	name: string,
	description: string,
	edited_at: string,
	created_at: string
}

export type PostOptions = Omit<Post, "id" | "created_at" | "edited_at" | "forum_id" | "poster_id">

export type User = {
	id: string,
	name: string,
	avatar: string | null,
	bot: boolean
}

export type Message = {
	id: string,
	forum_id: string,
	post_id: string
	author_id: string,
	content: string
	edited_at: string,
	created_at: string
}

export type MessageOptions = Omit<Message, "id" | "created_at" | "edited_at" | "forum_id" | "post_id" | "author_id">
