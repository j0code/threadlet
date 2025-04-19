import { Application } from "express"
import { Config } from "../main.js"
import { fetchDiscordUser, fetchOIDCToken, fetchOIDCUser, generateId, parse, respond, respondError, secureApiCall } from "../util.js"
import { dbStmt } from "../db.js"
import { Session } from "../types.js"
import express from "express"
import { ForumOptions, GatewayEvents, Message, MessageOptions, PostOptions } from "@j0code/threadlet-api/v0/types"
import WebSocket, { WebSocketServer } from "ws"
import { Server } from "node:http"

const HEARTBEAT_INTERVAL = 15000
const CONNECTION_TIMEOUT = 30000

let wss: WebSocketServer

export function getApp(config: Config): Application {
	const app = express()

	app.get("/auth", (req, res) => {
		res.json({
			type: "oidc",
			client_id: config.oidc.client_id,
			auth_url: config.oidc.auth_url
		});
	})

	app.post("/auth/oidc", async (req, res) => {
		console.log(req.body);
		if(!req.body.code || !req.body.codeVerifier) return void respondError(res, { status: 400, message: "missing code or codeVerifier" });
		const token = await fetchOIDCToken(config, req.body.code, req.body.codeVerifier, req.headers.origin || "");
		const access_token = token.access_token;
		try {
			dbStmt.createUser.run(token.id.sub)
			dbStmt.createSession.run(generateId(), token.id.sub, access_token)
		} catch (e) {
			console.error("[ERR] could not create session:", e)
			respondError(res, { status: 500, message: "session creation failed" })
			return
		}
	
		// Return the access_token to our client as { access_token: "..."}
		respond(res, 200, { access_token })
	});

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
	
	app.get("/forums", secureApiCall(config, (_, res) => {
		try {
			const forums = dbStmt.getForums.all()
			respond(res, 200, forums)
		} catch (e) {
			console.error("[ERR] could not get forums:", e)
			respondError(res, { status: 500, message: "forums query failed" })
		}
	}))
	
	app.post("/forums", secureApiCall(config, async (req, res, user) => {
		const { data, error } = parse(ForumOptions, req.body)
		if (error) return respondError(res, error)

		console.log("New forum:", user.preferred_username, data)
	
		try {
			const id = generateId()
			dbStmt.createForum.run(id, user.sub, data.name)

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

			const forum = getForum(id)
			respond(res, 201, forum)
		} catch (e) {
			console.error("[ERR] could not create forum:", e)
			respondError(res, { status: 500, message: "forum creation failed" })
		}
	}))
	
	app.get("/forums/:id", secureApiCall(config, (req, res) => {
		const forumId = req.params.id
	
		try {
			const forum = getForum(forumId)
			respond(res, 200, forum)
		} catch (e) {
			console.error("[ERR] could not get forum:", e)
			respondError(res, { status: 500, message: "forum query failed" })
		}
	}))
	
	app.get("/forums/:id/posts", secureApiCall(config, (req, res) => {
		const forumId = req.params.id
	
		try {
			const posts = dbStmt.getPosts.all(forumId)
			respond(res, 200, posts)
		} catch (e) {
			console.error("[ERR] could not get posts:", e)
			respondError(res, { status: 500, message: "posts query failed" })
		}
	}))

	app.get("/forums/:forum_id/posts/:post_id", secureApiCall(config, (req, res) => {
		const forumId = req.params.forum_id
		const postId	= req.params.post_id
	
		try {
			const post = getPost(postId)
			respond(res, 200, post)
		} catch (e) {
			console.error("[ERR] could not get post:", e)
			respondError(res, { status: 500, message: "post query failed" })
		}
	}))
	
	app.post("/forums/:id/posts", secureApiCall(config, async (req, res, user) => {
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
			dbStmt.createPost.run(id, forumId, user.sub, data.name, data.description)

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

			const post = getPost(id)
			respond(res, 201, post)
		} catch (e) {
			console.error("[ERR] could not create post:", e)
			console.log(id, forumId, user.sub, data.name, data.description)
			respondError(res, { status: 500, message: "post creation failed" })
		}
	}))
	
	app.get("/users/:id", secureApiCall(config, async (req, res) => {
		const userId = req.params.id
	
		try {
			const session = dbStmt.getSessionFromId.get(userId) as Session | undefined
			if (!session) {
				console.error("[ERR] no session", userId)
				respondError(res, { status: 500, message: "no available session" })
				return
			}
	
			// const user = await fetchDiscordUser(session.token)
			const user = await fetchOIDCUser(config, session.token)
			if (!user) return respondError(res, { status: 500, message: "Discord refused (e.g. expired token)" })
	
			// respond(res, 200, { id: user.sub, name: user.preferred_username, avatar: user.picture, bot: user.bot ?? false })
			respond(res, 200, { id: user.sub, name: user.preferred_username, avatar: user.picture, bot: false })
		} catch (e) {
			console.error("[ERR] could not get user:", e)
			respondError(res, { status: 500, message: "user query failed" })
		}
	}))
	
	app.post("/forums/:forum_id/posts/:post_id/messages", secureApiCall(config, async (req, res, user) => {
		const forumId = req.params.forum_id
		const postId	= req.params.post_id
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
			dbStmt.createMessage.run(id, postId, user.sub, data.content)
			const msg = dbStmt.getMessage.get(id)
			respond(res, 201, msg)

			broadcast("messageCreate", msg as Message)
		} catch (e) {
			console.error("[ERR] could not create message:", e)
			respondError(res, { status: 500, message: "message creation failed" })
		}
	}))
	
	app.get("/forums/:forum_id/posts/:post_id/messages", secureApiCall(config, async (req, res) => {
		const forumId = req.params.forum_id
		const postId	= req.params.post_id
	
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

export function openWSS(server: Server) {
	wss = new WebSocketServer({
		server, 
		path: "/api/v0/gateway"
	})
	const clients: Map<WebSocket, {
		address: any,
		lastActivity: number
	}> = new Map()

	wss.on("connection", (ws, req) => {
		const metadata = {
			address: req.headersDistinct["x-forwarded-for"]?.[0] || req.socket.remoteAddress,
			lastActivity: Date.now()
		}
		
		clients.set(ws, metadata)
		console.log(`Client connected:`, metadata.address)
		
		ws.on("pong", () => metadata.lastActivity = Date.now())
		
		// Message handler
		ws.on("message", (buffer: Buffer) => {
			metadata.lastActivity = Date.now()
			const rawData = buffer.toString("utf-8")

			console.log("Received:", rawData)
			ws.close(1008) // currently no client messages supported
		})
		
		// Close handler
		ws.on("close", (code, reason) => {
			clients.delete(ws)
			console.log(`Client disconnected: ${metadata.address}, ${code} '${reason}'`)
		})
		
		// Error handler
		ws.on("error", (error) => {
			console.error(`Client error (${metadata.address}):`, error)
			clients.delete(ws)
		})
	})

	// Heartbeat check
	setInterval(() => {
		const now = Date.now()
		wss.clients.forEach((ws) => {
			const metadata = clients.get(ws)

			if (!metadata) { // this shouldn't happen...
				console.log("Terminating connection without metadata")
				return ws.terminate()
			}

			if (now - metadata.lastActivity > CONNECTION_TIMEOUT) {
				console.log("Terminating inactive connection")
				return ws.terminate()
			}
			
			ws.ping()
		})
	}, HEARTBEAT_INTERVAL)
}

function broadcast<Event extends GatewayEvents>(event: Event["event"], data: Event["data"]) {
	const raw = JSON.stringify({ event, data })

	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(raw)
		}
	})
}

function getForum(forumId: string) {
	const forum: any	 = dbStmt.getForum.get(forumId)
	const tags:	any[] = dbStmt.getTags.all(forumId)

	return { ...forum, tags }
}

function getPost(postId: string) {
	const post: any	 = dbStmt.getPost.get(postId)
	const tags: any[] = dbStmt.getPostTags.all(postId)

	return { ...post, tags }
}