import YSON from "@j0code/yson"
import express, { type Request, type RequestHandler, type Response } from "express"
import Database from "better-sqlite3"
import fs from "fs/promises"
import { REST } from "@discordjs/rest"
import { APIUser, Routes } from "discord-api-types/v10"
import { type Session } from "./types.js"

type Config = {
	port: number,
	oauth: {
		client_id: string,
		client_secret: string
	}
}

const config = await YSON.load("./config.yson") as Config
const port = config.port

const dbSetup = await fs.readFile("./setup_db.sql", { encoding: "utf-8" })
const db = new Database("threadlet.db")
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")
db.exec(dbSetup)

const dbStmt = {
	createUser:    db.prepare(`INSERT OR IGNORE INTO users (id) VALUES (?)`),

	getSessionFromToken: db.prepare(`SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')`),
	getSessionFromId:    db.prepare(`SELECT * FROM sessions WHERE user_id = ? AND expires_at > datetime('now') ORDER BY created_at DESC LIMIT 1`),
	createSession: db.prepare(`INSERT INTO sessions (id, user_id, token) VALUES (?, ?, ?)`),

	getForums:     db.prepare(`SELECT * FROM forums`),
	getForum:      db.prepare(`SELECT * FROM forums WHERE id = ?`),
	createForum:   db.prepare(`INSERT INTO forums (id, owner_id, name) VALUES (?, ?, ?)`),

	getPosts:      db.prepare(`SELECT * FROM posts WHERE forum_id = ?`),
	getPost:       db.prepare(`SELECT * FROM posts WHERE id = ?`),
	createPost:    db.prepare(`INSERT INTO posts (id, forum_id, poster_id, name, description) VALUES (?, ?, ?, ?, ?)`),

	getMessages:   db.prepare(`SELECT messages.*, forum_id FROM messages INNER JOIN posts ON post_id = posts.id WHERE posts.id = ?`),
	getMessage:    db.prepare(`SELECT messages.*, forum_id FROM messages INNER JOIN posts ON post_id = posts.id WHERE messages.id = ?`),
	createMessage: db.prepare(`INSERT INTO messages (id, post_id, author_id, content) VALUES (?, ?, ?, ?)`),
} as const

console.log(dbStmt.getForums.all()) // debug

const app = express()

// Allow express to parse JSON bodies
app.use(express.json())

app.post("/api/token", async (req, res) => {
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
	const { access_token } = await response.json()

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

app.get("/api/forums", secureApiCall((_, res) => {
	try {
		const forums = dbStmt.getForums.all()
		res.status(200).send(forums)
	} catch (e) {
		console.error("[ERR] could not get forums:", e)
		res.status(500).send({ status: 500, detail: "forums query failed" })
	}
}))

app.post("/api/forums", secureApiCall(async (req, res, user) => {
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

app.get("/api/forums/:id", secureApiCall((req, res) => {
	const forumId = req.params.id

	try {
		const forum = dbStmt.getForum.get(forumId)
		res.status(200).send(forum)
	} catch (e) {
		console.error("[ERR] could not get forum:", e)
		res.status(500).send({ status: 500, detail: "forum query failed" })
	}
}))

app.get("/api/forums/:id/posts", secureApiCall((req, res) => {
	const forumId = req.params.id

	try {
		const posts = dbStmt.getPosts.all(forumId)
		res.status(200).send(posts)
	} catch (e) {
		console.error("[ERR] could not get posts:", e)
		res.status(500).send({ status: 500, detail: "posts query failed" })
	}
}))

app.post("/api/forums/:id/posts", secureApiCall(async (req, res, user) => {
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

app.get("/api/users/:id", secureApiCall(async (req, res) => {
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

app.post("/api/forums/:forum_id/posts/:post_id/messages", secureApiCall(async (req, res, user) => {
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

app.get("/api/forums/:forum_id/posts/:post_id/messages", secureApiCall(async (req, res) => {
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

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})

function generateId(): string {
	return randomHex(16)
}

function randomHex(length: number) {
	const buffer = new Uint8Array(length / 2) // half because each byte is 2 hex digits
	crypto.getRandomValues(buffer)

	let id: string[] = []
	buffer.forEach(value => id.push(value.toString(16).padStart(2, "0")))
	
	return id.join("")
}

async function checkAuth(authHeader: string | undefined): Promise<Session | null> {
	if (!authHeader) return null

	const parts = authHeader.split(" ")
	if (parts.length != 2 || parts[0] != "Bearer") return null

	try {
		const session = await dbStmt.getSessionFromToken.get(parts[1])
		// expiration is checked by sql query

		return session as Session // TODO: proper parsing
	} catch (e) {
		console.error("[ERR] could not get session:", parts[1], e)
		return null
	}
}

async function fetchDiscordUser(access_token: string): Promise<APIUser | null> {
	const rest = new REST({ version: '10', authPrefix: "Bearer" })
	rest.setToken(access_token)

	try {
		const user = await rest.get(Routes.user())
		if (!user || typeof user != "object" || !("id" in user)) {
			throw "user id missing from response"
		}
		return user as APIUser // TODO: proper parsing
	} catch (e) {
		console.error("[ERR] could not fetch user:", access_token, e)
		return null
	}
}

function secureApiCall(handler: (req: Request, res: Response, user: APIUser, session: Session) => void): RequestHandler {
	return async (req, res) => {
		const session = await checkAuth(req.headers.authorization)
		if (!session) {
			res.status(401).send({ status: 401, detail: "session invalid or expired" })
			return
		}

		const user = await fetchDiscordUser(session.token)
		if (!user) {
			res.status(500).send({ status: 500, detail: "Discord user not found" })
			return
		}

		handler(req, res, user, session)
	}
}
