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

	get message() {
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
