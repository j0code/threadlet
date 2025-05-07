import { APIUser } from "discord-api-types/v10"
import { dbStmt } from "./db.js"
import { generateId } from "./util.js"
import { ForumOptions, MessageOptions, PostOptions } from "@j0code/threadlet-api/v0/types"
import EventEmitter from "events"

class APIEvents extends EventEmitter {

	userCreate(user: APIUser) {
		dbStmt.createUser.run(user.id)
	}

	sessionCreate(user: APIUser, access_token: string) {
		dbStmt.createSession.run(generateId(), user.id, access_token)
	}

	forumCreate(user: APIUser, data: ForumOptions) {
		const id = generateId()
		dbStmt.createForum.run(id, user.id, data.name)
	
		const tags = data.tags ?? []
		for (let i = 0; i < tags.length; i++) {
			const tag = tags[i]
			const tagId = generateId()
			try {
				dbStmt.createTag.run(tagId, id, tag.emoji, tag.name)
			} catch (e) {
				console.error("[ERR] could not create tag:", e)
			}
		}
	
		this.emit("forumCreate", id)
		return id
	}

	postCreate(user: APIUser, forumId: string, data: PostOptions) {
		const id = generateId()
		
		dbStmt.createPost.run(id, forumId, user.id, data.name, data.description)

		const tags = data.tags ?? []
		// @ts-expect-error db results untyped
		const availableTags = dbStmt.getTags.all(forumId).map(tag => tag.id)

		for (let i = 0; i < tags.length; i++) {
			if (!availableTags.includes(tags[i])) {
				continue // unknown tag
			}
			try {
				dbStmt.createPostTag.run(tags[i], id)
			} catch (e) {
				console.error("[ERR] could not add tag to post:", e)
			}
		}

		this.emit("postCreate", id)
		return id
	}

	messageCreate(user: APIUser, postId: string, data: MessageOptions) {
		const id = generateId()
		dbStmt.createMessage.run(id, postId, user.id, data.content)
		
		this.emit("messageCreate", id)
		return id
	}

}

const apiEvents = new APIEvents()
export default apiEvents