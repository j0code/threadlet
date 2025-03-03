export type Session = {
	id: string,
	user_id: string,
	token: string
	expires_at: Date,
	created_at: Date
}

export type APIError = {
	status: number,
	message: string
}

export type ValidationError = APIError & {
	status: 400,
	message: "validation error",
	errors: unknown,
	messages: string[]
}
