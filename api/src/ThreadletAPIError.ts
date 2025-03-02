import { ZodError } from "zod"

/**
 * Threadlet API Error
 * 
 * Provides additional info for debugging
 * @module
 */
export default class ThreadletAPIError extends Error {

	route: string
	status: number
	statusText: string
	method: string
	requestBody: unknown
	rawError: unknown

	constructor(route: string, status: number, statusText: string, method: string, requestBody: unknown, rawError: unknown) {
		super()
		this.route = route
		this.status = status
		this.statusText = statusText
		this.method = method
		this.requestBody = requestBody
		this.rawError = rawError
	}

	get message(): string {
		const meta = {
			route: this.route,
			status: this.status,
			method: this.method,
			requestBody: this.requestBody,
			rawError: this.rawError
		}
		return `${this.status} ${this.statusText} ${JSON.stringify(meta, null, "  ")}`
	}

}

export class ThreadletZodError extends ThreadletAPIError {

	responseBody: unknown

	constructor(route: string, status: number, statusText: string, method: string, requestBody: unknown, rawError: ZodError, responseBody: unknown) {
		super(route, status, statusText, method, requestBody, rawError)
		this.responseBody = responseBody
	}

	get message(): string {
		const zodError = this.rawError as ZodError
		const meta = {
			route: this.route,
			status: this.status,
			method: this.method,
			requestBody: this.requestBody,
			responseBody: this.responseBody,
			rawError: this.rawError
		}
		return `${zodError.message} ${JSON.stringify(meta, null, "  ")}`
	}
	
}
