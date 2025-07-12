import { z } from "zod"

/**
 * API types
 * @module
 */

/** */
export type Tag = {
	id: string,
	forum_id: string,
	emoji: string
	name: string
	edited_at: string,
	created_at: string
}
export type TagOptions = Omit<Tag, "id" | "created_at" | "edited_at" | "forum_id">

export type Forum = {
	id: string,
	name: string,
	tags?: Tag[],
	created_at: string
}

export type ForumOptions = Omit<Forum, "id" | "tags" | "created_at"> & {
	tags?: TagOptions[]
}

export type Post = {
	id: string,
	forum_id: string,
	poster_id: string
	name: string,
	description: string,
	tags?: Tag[]
	edited_at: string,
	created_at: string,
}

export type PostOptions = Omit<Post, "id" | "tags" | "created_at" | "edited_at" | "forum_id" | "poster_id"> & {
	tags?: string[] // tag ids
}

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

const TagSchema = z.object({
	id: z.string(),
	forum_id: z.string(),
	emoji: z.string(),
	name: z.string(),
	edited_at: z.string(),
	created_at: z.string()
})

const ForumSchema = z.object({
	id: z.string(),
	name: z.string(),
	tags: TagSchema.array().optional(),
	created_at: z.string()
})

const PostSchema = z.object({
	id: z.string(),
	forum_id: z.string(),
	poster_id: z.string(),
	name: z.string(),
	description: z.string(),
	tags: TagSchema.array().optional(),
	edited_at: z.string(),
	created_at: z.string()
})

const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatar: z.string().nullable(),
	bot: z.boolean()
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

export const Forum:   z.Schema<Forum>   = ForumSchema
export const Post:    z.Schema<Post>    = PostSchema
export const User:    z.Schema<User>    = UserSchema
export const Message: z.Schema<Message> = MessageSchema
export const Tag:     z.Schema<Tag>     = TagSchema

export const MessageOptions:  z.ZodType<MessageOptions> = MessageSchema
	.omit({ id: true, forum_id: true, post_id: true, author_id: true, edited_at: true, created_at: true })

export const TagOptions:      z.ZodType<TagOptions>     = TagSchema
	.omit({ id: true, forum_id: true, edited_at: true, created_at: true })

export const ForumOptions:    z.ZodType<ForumOptions>   = ForumSchema
	.omit({ id: true, created_at: true })
	.extend({ tags: TagOptions.array().optional() })
	
export const PostOptions:     z.ZodType<PostOptions>    = PostSchema
	.omit({ id: true, forum_id: true, poster_id: true, edited_at: true, created_at: true })
	.extend({ tags: z.string().array().optional() })


export type GatewayEvent<Event extends string, Data> = {
	data: Data,
	event: Event
}

export type MessageCreateEvent = GatewayEvent<"messageCreate", Message>
export type MessageDeleteEvent = GatewayEvent<"messageDelete", Message>
export type ForumCreateEvent   = GatewayEvent<"forumCreate",   Forum>
export type ForumDeleteEvent   = GatewayEvent<"forumDelete",   Forum>
export type PostCreateEvent    = GatewayEvent<"postCreate",    Post>
export type PostDeleteEvent    = GatewayEvent<"postDelete",    Post>
export type PostTagAddEvent    = GatewayEvent<"postTagAdd",    Tag>
export type PostTagRemoveEvent = GatewayEvent<"postTagRemove", Tag>

export type GatewayEvents =
	| MessageCreateEvent
	| MessageDeleteEvent
	| ForumCreateEvent
	| ForumDeleteEvent
	| PostCreateEvent
	| PostDeleteEvent
	| PostTagAddEvent
	| PostTagRemoveEvent

type GatewayEventSchema<Data, Name extends z.core.util.Literal> = z.ZodObject<{
    data: z.ZodType<Data, unknown, z.core.$ZodTypeInternals<Data, unknown>>,
    event: z.ZodLiteral<Name>
}, z.core.$strip>


function gatewayEventSchema<Event extends GatewayEvents>(name: Event["event"], schema: z.ZodType<Event["data"]>): GatewayEventSchema<Event["data"], Event["event"]> {
	return z.object({
		data: schema,
		event: z.literal(name)
	})
}

export const GatewayEvents: z.ZodDiscriminatedUnion<GatewayEventSchema<GatewayEvents["data"], GatewayEvents["event"]>[]> = z.discriminatedUnion("event", [
	gatewayEventSchema("messageCreate", Message),
	gatewayEventSchema("messageDelete", Message),
	gatewayEventSchema("forumCreate",   Forum),
	gatewayEventSchema("forumDelete",   Forum),
	gatewayEventSchema("postCreate",    Post),
	gatewayEventSchema("postDelete",    Post),
	gatewayEventSchema("postTagAdd",    Tag),
	gatewayEventSchema("postTagRemove", Tag),
])