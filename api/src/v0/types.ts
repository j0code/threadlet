import { z } from "zod"

/**
 * API types
 * @module
 */

/** Shitty helper type (needed because jsr wants to make my life harder than it already is) */
type ObjSchema<T extends object> = z.ZodObject<any, "strip", z.ZodTypeAny, T, T>

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
	created_at: string,
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

const ForumSchema = z.object({
	id: z.string(),
	name: z.string(),
	created_at: z.string()
})

const PostSchema = z.object({
	id: z.string(),
	forum_id: z.string(),
	poster_id: z.string(),
	name: z.string(),
	description: z.string(),
	edited_at: z.string(),
	created_at: z.string()
})

const MessageSchema = z.object({
	id: z.string(),
	forum_id: z.string(),
	post_id: z.string(),
	author_id: z.string(),
	content: z.string(),
	edited_at: z.string(),
	created_at: z.string()
})

const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatar: z.string().nullable(),
	bot: z.boolean()
})

export const Forum:   ObjSchema<Forum>   = ForumSchema
export const Post:    ObjSchema<Post>    = PostSchema
export const Message: ObjSchema<Message> = MessageSchema
export const User:    ObjSchema<User>    = UserSchema

export const ForumOptions:    ObjSchema<ForumOptions>    = ForumSchema.omit({ id: true, created_at: true })
export const PostOptions:     ObjSchema<PostOptions>     = PostSchema.omit({ id: true, forum_id: true, poster_id: true, edited_at: true, created_at: true })
export const MessageOptions:  ObjSchema<MessageOptions>  = MessageSchema.omit({ id: true, forum_id: true, post_id: true, author_id: true, edited_at: true, created_at: true })
