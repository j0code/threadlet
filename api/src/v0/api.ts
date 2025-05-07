import { ZodType } from "zod"
import ThreadletAPIError, { ThreadletZodError } from "../ThreadletAPIError.js"
import { User, Forum, Post, type ForumOptions, type PostOptions, type MessageOptions, Message, GatewayEvents } from "./types.js"
import EventEmitter from "../EventEmitter.js"

const API_VERSION = "v0"

/**
 * Threadlet API
 * @module
 */
export default class ThreadletAPI extends EventEmitter {

	public readonly API_ROOT: string
	public readonly GATEWAY:  string

	/**
	 * OAuth2 access token
	 */
	private readonly access_token: string

	public readonly userCache:    Map<string, User>
	public readonly forumCache:   Map<string, Forum>
	public readonly postCache:    Map<string, Post>
	public readonly messageCache: Map<string, Message>

	private readonly wss: WebSocket

	constructor(access_token: string, options: APIOptions = defaultOptions) {
		super()
		this.API_ROOT = options.API_ROOT
		this.GATEWAY  = options.GATEWAY
		this.access_token = access_token

		this.userCache    = new Map()
		this.forumCache   = new Map()
		this.postCache    = new Map()
		this.messageCache = new Map()

		this.wss = new WebSocket(this.GATEWAY)

		this.wss.addEventListener("open", event => {
			console.log("WebSocket connected!")
		})

		this.wss.addEventListener("message", (event) => {
			let rawData
			try {
				rawData = JSON.parse(event.data)
			} catch (e) {
				console.error("Server sent invalid json:", e)
				this.wss.close(1003, "invalid json data")
				return
			}

			console.log("WSS Message:", rawData)

			const { data, error } = GatewayEvents.safeParse(rawData)
			if (error) {
				// TODO: log error
				return
			}

			this.emit(data.event, data.data)
		})

		this.wss.addEventListener("error", event => {
			console.log("WSS error!", event)
		})

		this.wss.addEventListener("close", event => {
			console.log("WSS closed", event.code, event.reason, event.wasClean)
		})
	}

	/**
	 * Get all forums
	 * @returns all forums
	 * @throws {ThreadletAPIError}
	 */
	async getForums(): Promise<Forum[]> {
		return this.get("/forums", Forum.array())
	}

	/**
	 * Create a new forum
	 * @param forum forum options
	 * @returns the forum
	 * @throws {ThreadletAPIError}
	 */
	async createForum(forum: ForumOptions): Promise<Forum> {
		return this.post("/forums", forum, Forum)
	}

	/**
	 * Get a forum from ID
	 * @param forumId id of the forum
	 * @returns the forum
	 * @throws {ThreadletAPIError}
	 */
	async getForum(forumId: string, _options?: Partial<FetchOptions>): Promise<Forum> {
		const options = validateOptions(_options)
		if (this.forumCache.has(forumId) && !options.force) {
			return this.forumCache.get(forumId)!
		}

		const forum = await this.get(`/forums/${forumId}`, Forum)
		this.forumCache.set(forumId, forum)
		return forum
	}

	/**
	 * Get all posts in a forum
	 * @param forumId id of the forum
	 * @returns all posts in the forum
	 * @throws {ThreadletAPIError}
	 */
	async getPosts(forumId: string): Promise<Post[]> {
		return this.get(`/forums/${forumId}/posts`, Post.array())
	}

	/**
	 * Get a post from ID
	 * @param forumId id of the forum
	 * @param postId id of the post
	 * @returns the post
	 * @throws {ThreadletAPIError}
	 */
	async getPost(forumId: string, postId: string, _options?: Partial<FetchOptions>): Promise<Post> {
		const options = validateOptions(_options)
		if (this.postCache.has(postId) && !options.force) {
			return this.postCache.get(postId)!
		}

		const post = await this.get(`/forums/${forumId}/posts/${postId}`, Post)
		this.postCache.set(postId, post)
		return post
	}

	/**
	 * Create a new post
	 * @param forumId id of the forum
	 * @param post post options
	 * @returns the post
	 * @throws {ThreadletAPIError}
	 */
	async createPost(forumId: string, post: PostOptions): Promise<Post> {
		return this.post(`/forums/${forumId}/posts`, post, Post)
	}

	/**
	 * Get a user
	 * @param userId id of the user
	 * @returns the user
	 * @throws {ThreadletAPIError}
	 */
	async getUser(userId: string, _options?: Partial<FetchOptions>): Promise<User> {
		const options = validateOptions(_options)
		if (this.userCache.has(userId) && !options.force) {
			return this.userCache.get(userId)!
		}

		const user = await this.get(`/users/${userId}`, User)
		this.userCache.set(user.id, user)
		return user
	}

	/**
	 * Create a new message
	 * @param forumId id of the forum
	 * @param postId id of the post
	 * @param msg message options
	 * @returns the message
	 * @throws {ThreadletAPIError}
	 */
	async createMessage(forumId: string, postId: string, msg: MessageOptions): Promise<Message> {
		return this.post(`/forums/${forumId}/posts/${postId}/messages`, msg, Message)
	}

	/**
	 * Get all messages on a post
	 * @param forumId id of the forum
	 * @param postId id of the post
	 * @returns all messages on the post
	 */
	async getMessages(forumId: string, postId: string): Promise<Message[]> {
		return this.get(`/forums/${forumId}/posts/${postId}/messages`, Message.array())
	}

	private get<T>(route: string, schema: ZodType<T>): Promise<T> {
		return fetch(`${this.API_ROOT}${route}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${this.access_token}`
			}
		})
		.then(async res => ({ res, data: await res.json()}))
		.then(({res, data}) => {
			if (!res.ok) {
				throw new ThreadletAPIError(route, res.status, res.statusText, "GET", null, data)
			}

			const { data: parsedData, error } = schema.safeParse(data)
			if (error) {
				throw new ThreadletZodError(route, res.status, res.statusText, "GET", null, error, data)
			}

			return parsedData
		})
	}

	private post<T>(route: string, requestBody: any, schema: ZodType<T>): Promise<T> {
		return fetch(`${this.API_ROOT}${route}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.access_token}`
			},
			body: JSON.stringify(requestBody)
		}).then(async res => ({ res, data: await res.json()}))
		.then(({res, data}) => {
			if (!res.ok) {
				console.log(res, data)
				throw new ThreadletAPIError(route, res.status, res.statusText, "POST", requestBody, data)
			}

			const { data: parsedData, error } = schema.safeParse(data)
			if (error) {
				throw new ThreadletZodError(route, res.status, res.statusText, "POST", requestBody, error, data)
			}

			return data
		})
	}

}

/**
 * Options for {@link ThreadletAPI}
 */
export type APIOptions = {
	API_ROOT: string
	GATEWAY:  string
}

const defaultOptions: APIOptions = {
	API_ROOT: `/.proxy/api/${API_VERSION}`,
	GATEWAY:  `/.proxy/api/${API_VERSION}/gateway`
}

/**
 * Fetch options
 */
export type FetchOptions = {
	/** force fetching (skip cache) */
	force: boolean
}

const defaultFetchOptions: FetchOptions = {
	force: false
}

function validateOptions(options?: Partial<FetchOptions>) {
	if (!options) return defaultFetchOptions
	return { ...defaultFetchOptions, ...options}
}