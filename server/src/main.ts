import YSON from "@j0code/yson"
import express from "express"
import Database from "better-sqlite3"
import fs from "fs/promises"

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

const smt = db.prepare("SELECT * FROM forums") // debug
console.log(smt.all()) // debug

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

	// Return the access_token to our client as { access_token: "..."}
	res.send({access_token})
})

const getForums = db.prepare(`SELECT * FROM forums`)
app.get("/api/forums", (req, res) => {
	try {
		const forums = getForums.all()
		res.status(200).send(forums)
	} catch (e) {
		console.error("[ERR] could not get forums:", e)
		res.sendStatus(500)
	}
})

const postForum = db.prepare(`INSERT INTO forums (id, name) VALUES (?, ?)`)
const getForum  = db.prepare(`SELECT * FROM forums WHERE id = ?`)
app.post("/api/forums", (req, res) => {
	const data = req.body
	console.log("New forum:", data)

	try {
		const id = generateId()
		postForum.run(id, data.name)
		const forum = getForum.get(id)
		res.status(200).send(forum)
	} catch (e) {
		console.error("[ERR] could not create forum:", e)
		res.sendStatus(500)
	}
})

app.get("/api/forums/:id", (req, res) => {
	const forumId = req.params.id

	try {
		const forum = getForum.get(forumId)
		res.status(200).send(forum)
	} catch (e) {
		console.error("[ERR] could not get forums:", e)
		res.sendStatus(500)
	}
})

const getPosts = db.prepare(`SELECT * FROM posts WHERE forum_id = ?`)
app.get("/api/forums/:id/posts", (req, res) => {
	const data = req.body
	const forumId = req.params.id

	try {
		const posts = getPosts.all(forumId)
		res.status(200).send(posts)
	} catch (e) {
		console.error("[ERR] could not get posts:", e)
		res.sendStatus(500)
	}
})

const postPost = db.prepare(`INSERT INTO posts (id, forum_id, name, description) VALUES (?, ?, ?, ?)`)
const getPost  = db.prepare(`SELECT * FROM posts WHERE id = ?`)
app.post("/api/forums/:id/posts", (req, res) => {
	const data = req.body
	const forumId = req.params.id
	console.log("New post:", forumId, data)

	try {
		const id = generateId()
		postPost.run(id, forumId, data.name, data.description)
		const post = getPost.get(id)
		res.status(200).send(post)
	} catch (e) {
		console.error("[ERR] could not create post:", e)
		res.sendStatus(500)
	}
})

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})

function generateId(): string {
	const buffer = new Uint8Array(8)
	crypto.getRandomValues(buffer)

	let id: string[] = []
	buffer.forEach(value => id.push(value.toString(16)))
	
	return id.join("")
}
