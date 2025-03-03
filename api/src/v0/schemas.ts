import { z } from "zod"
import {
	Forum   as ForumType,
	Message as MessageType,
	Post    as PostType,
	User    as UserType,
	ForumOptions    as ForumOptionsType,
	MessageOptions  as MessageOptionsType,
	PostOptions     as PostOptionsType
} from "./types.js"

/** Shitty helper type (needed because jsr wants to make my life harder than it already is) */
type ObjSchema<T extends object> = z.ZodObject<any, "strip", z.ZodTypeAny, T, T>

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

export const Forum:   ObjSchema<ForumType>   = ForumSchema
export const Post:    ObjSchema<PostType>    = PostSchema
export const Message: ObjSchema<MessageType> = MessageSchema
export const User:    ObjSchema<UserType>    = UserSchema

export const ForumOptions:    ObjSchema<ForumOptionsType>    = ForumSchema.omit({ id: true, created_at: true })
export const PostOptions:     ObjSchema<PostOptionsType>     = PostSchema.omit({ id: true, forum_id: true, poster_id: true, edited_at: true, created_at: true })
export const MessageOptions:  ObjSchema<MessageOptionsType>  = MessageSchema.omit({ id: true, forum_id: true, post_id: true, author_id: true, edited_at: true, created_at: true })
