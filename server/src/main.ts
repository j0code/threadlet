import YSON from "@j0code/yson"
import express from "express"
import Database from "better-sqlite3"
import fs from "fs/promises"
import { dbStmt } from "./db.js"
import * as v0 from "./v0/api.js"

export type Config = {
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

console.log(dbStmt.getForums.all()) // debug

const app = express()

// Allow express to parse JSON bodies
app.use(express.json())

app.use("/api/v0", v0.getApp(config))

const server = app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})

v0.openWSS(server)