import Database, { Statement } from "better-sqlite3"
import fs from "fs/promises"

const dbSetup = await fs.readFile("./setup_db.sql", { encoding: "utf-8" })
const db = new Database("threadlet.db")
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")
db.exec(dbSetup)

const _dbStmt = {
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
} as const satisfies Record<string, Statement>

export const dbStmt: Record<string, Statement> = _dbStmt
