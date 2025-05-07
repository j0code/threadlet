import { Forum, Message, Post } from "@j0code/threadlet-api/v0/types"
import { dbStmt } from "../db.js"
import { Session } from "../types.js"

export function getForums(): Forum[] {
	return dbStmt.getForums.all() as Forum[]
}

export function getForum(forumId: string): Forum {
	const forum: any   = dbStmt.getForum.get(forumId)
	const tags:	 any[] = dbStmt.getTags.all(forumId)

	return { ...forum, tags }
}

export function getPosts(forumId: string): Post[] {
	return dbStmt.getPosts.all(forumId) as Post[]
}

export function getPost(postId: string): Post {
	const post: any	  = dbStmt.getPost.get(postId)
	const tags: any[] = dbStmt.getPostTags.all(postId)

	return { ...post, tags }
}

export function getMessages(postId: string): Message[] {
	return dbStmt.getMessages.all(postId) as Message[]
}

export function getMessage(messageId: string): Message {
	return dbStmt.getMessage.get(messageId) as Message
}

export function getSession(userId: string): Session | undefined {
	return dbStmt.getSessionFromId.get(userId) as Session | undefined
}