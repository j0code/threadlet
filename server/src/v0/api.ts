import { Application } from "express"
import { Config } from "../main.js"
import { fetchDiscordUser, generateId, secureApiCall } from "../util.js"
import { dbStmt } from "../db.js"
import { Session } from "../types.js"
import express from "express"

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
			res.status(500).send({ status: 500, detail: "received invalid json from Discord" })
			return
		}
		const { access_token } = data
	
		// Fetch user
		const user = await fetchDiscordUser(access_token)
		if (!user) {
			res.status(500).send({ status: 500, detail: "Discord user not found" })
			return
		}
	
		// Create or update user in db + create session
		try {
			dbStmt.createUser.run(user.id)
			dbStmt.createSession.run(generateId(), user.id, access_token)
		} catch (e) {
			console.error("[ERR] could not create session:", e)
			res.status(500).send({ status: 500, detail: "session creation failed" })
			return
		}
	
		// Return the access_token to our client as { access_token: "..."}
		res.send({access_token})
	})
	
	app.get("/forums", secureApiCall((_, res) => {
		try {
			const forums = dbStmt.getForums.all()
			res.status(200).send(forums)
		} catch (e) {
			console.error("[ERR] could not get forums:", e)
			res.status(500).send({ status: 500, detail: "forums query failed" })
		}
	}))
	
	app.post("/forums", secureApiCall(async (req, res, user) => {
		const data = req.body
		console.log("New forum:", user.username, data)
	
		try {
			const id = generateId()
			dbStmt.createForum.run(id, user.id, data.name)
			const forum = dbStmt.getForum.get(id)
			res.status(201).send(forum)
		} catch (e) {
			console.error("[ERR] could not create forum:", e)
			res.status(500).send({ status: 500, detail: "forum creation failed" })
		}
	}))
	
	app.get("/forums/:id", secureApiCall((req, res) => {
		const forumId = req.params.id
	
		try {
			const forum = dbStmt.getForum.get(forumId)
			res.status(200).send(forum)
		} catch (e) {
			console.error("[ERR] could not get forum:", e)
			res.status(500).send({ status: 500, detail: "forum query failed" })
		}
	}))
	
	app.get("/forums/:id/posts", secureApiCall((req, res) => {
		const forumId = req.params.id
	
		try {
			const posts = dbStmt.getPosts.all(forumId)
			res.status(200).send(posts)
		} catch (e) {
			console.error("[ERR] could not get posts:", e)
			res.status(500).send({ status: 500, detail: "posts query failed" })
		}
	}))
	
	app.post("/forums/:id/posts", secureApiCall(async (req, res, user) => {
		const data = req.body
		const forumId = req.params.id
		console.log("New post:", forumId, data)
	
		try {
			dbStmt.getForum.get(forumId)
		} catch (e) {
			console.error("[ERR] could not get forum:", e)
			res.status(404).send({ status: 404, detail: "forum not found" })
			return
		}
	
		const id = generateId()
		try {
			dbStmt.createPost.run(id, forumId, user.id, data.name, data.description)
			const post = dbStmt.getPost.get(id)
			res.status(201).send(post)
		} catch (e) {
			console.error("[ERR] could not create post:", e)
			console.log(id, forumId, user.id, data.name, data.description)
			res.status(500).send({ status: 500, detail: "post creation failed" })
		}
	}))
	
	app.get("/users/:id", secureApiCall(async (req, res) => {
		const userId = req.params.id
	
		try {
			const session = dbStmt.getSessionFromId.get(userId) as Session | undefined
			if (!session) {
				console.error("[ERR] no session", userId)
				res.status(500).send({ status: 500, detail: "no available session" })
				return
			}
	
			const user = await fetchDiscordUser(session.token)
	
			if (!user) {
				res.status(500).send({ status: 500, detail: "Discord refused (e.g. expired token)" })
				return
			}
	
			res.status(200).send({ id: user.id, name: user.global_name, avatar: user.avatar, bot: user.bot })
		} catch (e) {
			console.error("[ERR] could not get user:", e)
			res.status(500).send({ status: 500, detail: "user query failed" })
		}
	}))
	
	app.post("/forums/:forum_id/posts/:post_id/messages", secureApiCall(async (req, res, user) => {
		const data = req.body
		const forumId = req.params.forum_id
		const postId  = req.params.post_id
		console.log("New message:", forumId, postId, data)
	
		try {
			const post = dbStmt.getPost.get(postId)
			// @ts-expect-error TODO: use API types
			if (post.forum_id != forumId) {
				res.status(404).send({ status: 404, detail: "post not found" })
				return
			}
		} catch (e) {
			console.error("[ERR] could not get post:", e)
			res.status(404).send({ status: 404, detail: "post not found" })
			return
		}
	
		try {
			const id = generateId()
			dbStmt.createMessage.run(id, postId, user.id, data.content)
			const msg = dbStmt.getMessage.get(id)
			res.status(201).send(msg)
		} catch (e) {
			console.error("[ERR] could not message post:", e)
			res.status(500).send({ status: 500, detail: "message creation failed" })
		}
	}))
	
	app.get("/forums/:forum_id/posts/:post_id/messages", secureApiCall(async (req, res) => {
		const forumId = req.params.forum_id
		const postId  = req.params.post_id
	
		try {
			const post = dbStmt.getPost.get(postId)
			// @ts-expect-error TODO: use API types
			if (post.forum_id != forumId) {
				res.status(404).send({ status: 404, detail: "post not found" })
				return
			}
		} catch (e) {
			console.error("[ERR] could not get post:", e)
			res.status(404).send({ status: 404, detail: "post not found" })
			return
		}
	
		try {
			const messages = dbStmt.getMessages.all(postId)
			res.status(200).send(messages)
		} catch (e) {
			console.error("[ERR] could not get messages:", e)
			res.status(500).send({ status: 500, detail: "messages query failed" })
		}
	}))

	return app
}
