import { REST } from "@discordjs/rest"
import { dbStmt } from "./db.js"
import { APIError, Session, ValidationError } from "./types.js"
import { APIUser, Routes } from "discord-api-types/v10"
import { Request, RequestHandler, Response } from "express"
import { fromZodError } from "zod-validation-error/v4"
import z, { ZodType } from "zod"

export function generateId(): string {
	return randomHex(16)
}

export function randomHex(length: number) {
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

export async function fetchDiscordUser(access_token: string): Promise<APIUser | null> {
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

export function secureApiCall(handler: (req: Request, res: Response, user: APIUser, session: Session) => void): RequestHandler {
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

type parseReturn<T> = { data: T, error: undefined } | { data: undefined, error: ValidationError }

export function parse<T>(schema: ZodType<T>, rawData: unknown): parseReturn<T> {
	const { data, error: zodError } = schema.safeParse(rawData)

	if (zodError) {
		const valErr = fromZodError(zodError, { prefix: null, issueSeparator: "\u0000" })
		const error: ValidationError = {
			status: 400,
			message: "validation error",
			errors: z.treeifyError(zodError),
			messages: valErr.message.split("\u0000")
		}
		return { data: undefined, error}
	}

	return { data, error: undefined }
}

export function respond(res: Response, status: number, data: unknown) {
	res.status(status).send(data)
}

export function respondError(res: Response, info: APIError ) {
	res.status(info.status).send(info)
}
