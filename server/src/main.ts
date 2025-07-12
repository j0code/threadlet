import YSON from "@j0code/yson"
import express from "express"
import Database from "better-sqlite3"
import fs from "fs/promises"
import path from "path"
import { dbStmt } from "./db.js"
import * as v0 from "./v0/api.js"
import { safeJoin } from "./safeJoin.js"

export type Config = {
	port: number,
	oauth: {
		client_id: string,
		client_secret: string
	},
	client: {
		public: string
	}
}

const config = await YSON.load("./config.yson") as Config
const port = config.port

const dbSetup = await fs.readFile("./setup_db.sql", { encoding: "utf-8" })
const db = new Database("threadlet.db")
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")
db.exec(dbSetup)

console.log(dbStmt.getForums.all()) // debug

const app = express()

app.use(async (req, res, next) => {
	if (req.method != "GET" && req.method != "HEAD") return next()
	if (req.path.startsWith("/api/")) return next()

	console.log(req.method, req.path)

	if (req.path.includes("%")) {
		if (req.headers.origin) {
			res.status(404).end()
		} else {
			res.redirect(302, "/")
		}
		return
	}

	if (req.path.includes("..")) {
		res.status(418).end()
		return
	}

	const publicDir = path.posix.resolve(config.client.public)
	const relPath = req.path.replace(/\/+$/, "") || "/index.html"
	const filePath = safeJoin(publicDir, relPath)

	if (!filePath) {
		res.status(418).end()
		return
	}

	try {
		const stat = await fs.stat(filePath)
		if (!stat.isFile()) throw new Error("Not a file")

		if (filePath.endsWith(".js")) {
			res.setHeader("X-Content-Type-Options", "nosniff")
		}

		res.sendFile(filePath, (err) => {
			if (err) {
				res.status(400).end()
			}
		})
	} catch (e) {
		res.status(400).end()
	}
})

// Allow express to parse JSON bodies
app.use(express.json())

app.use("/api/v0", v0.getApp(config))

const server = app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})

v0.openWSS(server)