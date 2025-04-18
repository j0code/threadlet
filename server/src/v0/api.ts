import { Application } from "express"
import { Config } from "../main.js"
import { fetchDiscordUser, generateId, parse, respond, respondError, secureApiCall } from "../util.js"
import { dbStmt } from "../db.js"
import { Session } from "../types.js"
import express from "express"
import { ForumOptions, MessageOptions, PostOptions } from "@j0code/threadlet-api/v0/types"

export function getApp(config: Config): Application {
	const app = express()

	app.post(`/token`, async (req, res) => {
		// Exchange the code for an access_token
		const response = await fetch(`https://discord.com/api/oauth2/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				client_id: config.oauth.client_id,
				client_secret: config.oauth.client_secret,
				grant_type: "authorization_code",
				code: req.body.code
			})
		})
	
		// Retrieve the access_token from the response
		let data: any
		try {
			data = await response.json()
		} catch (e) {
			console.error("[ERR]: received invalid json from Discord", e)
			respondError(res, { status: 500, message: "received invalid json from Discord" })
			return
		}
		const { access_token } = data
		if (!access_token || typeof access_token != "string") {
			console.error("[ERR]: received no access token from Discord", data)
			respondError(res, { status: 500, message: "no access token provided" })
			return
		}
	
		// Fetch user
		const user = await fetchDiscordUser(access_token)
		if (!user) {
			respondError(res, { status: 500, message: "Discord user not found" })
			return
		}
	
		// Create or update user in db + create session
		try {
			dbStmt.createUser.run(user.id)
			dbStmt.createSession.run(generateId(), user.id, access_token)
		} catch (e) {
			console.error("[ERR] could not create session:", e)
			respondError(res, { status: 500, message: "session creation failed" })
			return
		}
	
		// Return the access_token to our client as { access_token: "..."}
		respond(res, 200, { access_token })
	})
	
	app.get("/forums", secureApiCall((_, res) => {
		try {
			const forums = dbStmt.getForums.all()
			respond(res, 200, forums)
		} catch (e) {
			console.error("[ERR] could not get forums:", e)
			respondError(res, { status: 500, message: "forums query failed" })
		}
	}))
	
	app.post("/forums", secureApiCall(async (req, res, user) => {
		const { data, error } = parse(ForumOptions, req.body)
		if (error) return respondError(res, error)

		console.log("New forum:", user.username, data)
	
		try {
			const id = generateId()
			dbStmt.createForum.run(id, user.id, data.name)

			for (let i = 0; i < data.tags.length; i++) {
				const tag = data.tags[i]
				const tagId = generateId()
				try {
					dbStmt.createTag.run(tagId, id, tag.emoji, tag.name)
				} catch (e) {
					console.error("[ERR] could not create tag:", e)
				}
			}

			const forum = getForum(id)
			respond(res, 201, forum)
		} catch (e) {
			console.error("[ERR] could not create forum:", e)
			respondError(res, { status: 500, message: "forum creation failed" })
		}
	}))
	
	app.get("/forums/:id", secureApiCall((req, res) => {
		const forumId = req.params.id
	
		try {
			const forum = getForum(forumId)
			respond(res, 200, forum)
		} catch (e) {
			console.error("[ERR] could not get forum:", e)
			respondError(res, { status: 500, message: "forum query failed" })
		}
	}))
	
	app.get("/forums/:id/posts", secureApiCall((req, res) => {
		const forumId = req.params.id
	
		try {
			const posts = dbStmt.getPosts.all(forumId)
			respond(res, 200, posts)
		} catch (e) {
			console.error("[ERR] could not get posts:", e)
			respondError(res, { status: 500, message: "posts query failed" })
		}
	}))
	
	app.post("/forums/:id/posts", secureApiCall(async (req, res, user) => {
		const forumId = req.params.id
		const { data, error } = parse(PostOptions, req.body)
		if (error) return respondError(res, error)

		console.log("New post:", forumId, data)
	
		try {
			getForum(forumId)
		} catch (e) {
			console.error("[ERR] could not get forum:", e)
			respondError(res, { status: 404, message: "forum not found" })
			return
		}
	
		const id = generateId()
		try {
			dbStmt.createPost.run(id, forumId, user.id, data.name, data.description)
			const post = dbStmt.getPost.get(id)
			respond(res, 201, post)
		} catch (e) {
			console.error("[ERR] could not create post:", e)
			console.log(id, forumId, user.id, data.name, data.description)
			respondError(res, { status: 500, message: "post creation failed" })
		}
	}))
	
	app.get("/users/:id", secureApiCall(async (req, res) => {
		const userId = req.params.id
	
		try {
			const session = dbStmt.getSessionFromId.get(userId) as Session | undefined
			if (!session) {
				console.error("[ERR] no session", userId)
				respondError(res, { status: 500, message: "no available session" })
				return
			}
	
			const user = await fetchDiscordUser(session.token)
			if (!user) return respondError(res, { status: 500, message: "Discord refused (e.g. expired token)" })
	
			respond(res, 200, { id: user.id, name: user.global_name, avatar: user.avatar, bot: user.bot ?? false })
		} catch (e) {
			console.error("[ERR] could not get user:", e)
			respondError(res, { status: 500, message: "user query failed" })
		}
	}))
	
	app.post("/forums/:forum_id/posts/:post_id/messages", secureApiCall(async (req, res, user) => {
		const forumId = req.params.forum_id
		const postId  = req.params.post_id
		const { data, error } = parse(MessageOptions, req.body)
		if (error) return respondError(res, error)

		console.log("New message:", forumId, postId, data)
	
		try {
			const post = dbStmt.getPost.get(postId)
			// @ts-expect-error TODO: use API types
			if (post.forum_id != forumId) {
				respondError(res, { status: 404, message: "post not found" })
				return
			}
		} catch (e) {
			console.error("[ERR] could not get post:", e)
			respondError(res, { status: 404, message: "post not found" })
			return
		}
	
		try {
			const id = generateId()
			dbStmt.createMessage.run(id, postId, user.id, data.content)
			const msg = dbStmt.getMessage.get(id)
			respond(res, 201, msg)
		} catch (e) {
			console.error("[ERR] could not create message:", e)
			respondError(res, { status: 500, message: "message creation failed" })
		}
	}))
	
	app.get("/forums/:forum_id/posts/:post_id/messages", secureApiCall(async (req, res) => {
		const forumId = req.params.forum_id
		const postId  = req.params.post_id
	
		try {
			const post = dbStmt.getPost.get(postId)
			// @ts-expect-error TODO: use API types
			if (post.forum_id != forumId) {
				respondError(res, { status: 404, message: "post not found" })
				return
			}
		} catch (e) {
			console.error("[ERR] could not get post:", e)
			respondError(res, { status: 404, message: "post not found" })
			return
		}
	
		try {
			const messages = dbStmt.getMessages.all(postId)
			respond(res, 200, messages)
		} catch (e) {
			console.error("[ERR] could not get messages:", e)
			respondError(res, { status: 500, message: "messages query failed" })
		}
	}))

	return app
}

function getForum(forumId: string) {
	const forum: any   = dbStmt.getForum.get(forumId)
	const tags:  any[] = dbStmt.getTags.all(forumId)

	return { ...forum, tags }
}