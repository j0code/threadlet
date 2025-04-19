import { REST } from "@discordjs/rest"
import { dbStmt } from "./db.js"
import { APIError, Session, ValidationError } from "./types.js"
import { APIUser, Routes } from "discord-api-types/v10"
import { Request, RequestHandler, Response } from "express"
import { fromZodError } from "zod-validation-error"
import { ZodType } from "zod"
import { Config } from "./main.js"

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

export type OIDCUser = {
	aud: string[],
	exp: number,
	family_name: string, // Last name of the user
	given_name: string, // First name of the user
	iat: number,
	iss: string, // Auth server
	name: string, // Full name of the user
	picture: string, // URL to the user's avatar
	preferred_username: string,
	sub: string, // Subject - Identifier for the End-User at the Issuer.
	type: string
};

export type OIDCToken = {
	access_token: string,
	token_type: "Bearer",
	id_token: string,
	id: OIDCUser, // Generated from id_token
	refresh_token: string,
	expires_in: number,
};

export async function fetchOIDCToken(config: Config, code: string, codeVerifier: string, origin: string): Promise<OIDCToken> {
	const params = new URLSearchParams();
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("client_id", "3da7e35e-7e50-4a0d-93f2-c59efa245e05");
	params.append("code_verifier", codeVerifier);
	params.append("redirect_uri", `${origin}/auth_callback`);

	const res = await fetch(config.oidc.token_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: params
	}).then(res => res.json());

	// console.log(res);
	if(res.error) {
		console.error("[ERR] OIDC token error:", res.error);
		throw new Error(res.error);
	}
	const id_token = res.id_token; // This is a JWT which contains the user's identity
	const user = JSON.parse(atob(id_token.split(".")[1]));
	return {
		...res,
		id: user,
	};
}

export async function fetchOIDCUser(config: Config, access_token: string): Promise<OIDCUser | null> {
	try {
		return await fetch(config.oidc.userinfo_url, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${access_token}`
			}
		}).then(res => res.json());
	} catch (e) {
		return null
	}
}

export function secureApiCall(config: Config, handler: (req: Request, res: Response, user: OIDCUser, session: Session) => void): RequestHandler {
	return async (req, res) => {
		const session = await checkAuth(req.headers.authorization)
		if (!session) {
			res.status(401).send({ status: 401, detail: "session invalid or expired" })
			return
		}

		// const user = await fetchDiscordUser(session.token)
		// if (!user) {
		// 	res.status(500).send({ status: 500, detail: "Discord user not found" })
		// 	return
		// }
		const user = await fetchOIDCUser(config, session.token)
		if (!user) {
			res.status(500).send({ status: 500, detail: "OIDC user not found" })
			return
		}

		handler(req, res, user, session)
	}
}

type parseReturn<T> = { data: T, error: undefined } | { data: undefined, error: ValidationError }

export function parse<T>(schema: ZodType<T>, rawData: unknown): parseReturn<T> {
	const { data, error: zodError } = schema.safeParse(rawData)

	if (zodError) {
		const valErr = fromZodError(zodError, { prefix: null, issueSeparator: "\u0000", unionSeparator: "\u0001" })
		const error: ValidationError = {
			status: 400,
			message: "validation error",
			errors: zodError.format(),
			messages: valErr.message.split("\u0000").flatMap(msg => msg.split("\u0001"))
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
