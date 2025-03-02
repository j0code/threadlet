/**
 * API types
 * @module
 */

import { z } from "zod"

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

export const Forum: ObjSchema<Forum> = z.object({
	id: z.string(),
	name: z.string(),
	created_at: z.string()
})

export const Post: ObjSchema<Post> = z.object({
	id: z.string(),
	forum_id: z.string(),
	poster_id: z.string(),
	name: z.string(),
	description: z.string(),
	edited_at: z.string(),
	created_at: z.string()
})

export const Message: ObjSchema<Message> = z.object({
	id: z.string(),
	forum_id: z.string(),
	post_id: z.string(),
	author_id: z.string(),
	content: z.string(),
	edited_at: z.string(),
	created_at: z.string()
})

export const User: ObjSchema<User> = z.object({
	id: z.string(),
	name: z.string(),
	avatar: z.string().nullable(),
	bot: z.boolean()
})
