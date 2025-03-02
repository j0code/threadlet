import ThreadletAPIError from "./ThreadletAPIError.js"
import { User, Forum, Post, type ForumOptions, type PostOptions, type MessageOptions, Message } from "./types.js"

/**
 * Threadlet API
 * @module
 */
export default class ThreadletAPI {

	public readonly API_ROOT: string

	/**
	 * OAuth2 access token
	 */
	private readonly access_token: string

	constructor(access_token: string, options: APIOptions = defaultOptions) {
		this.API_ROOT = options.API_ROOT
		this.access_token = access_token
	}

	/**
	 * Get all forums
	 * @returns all forums
	 * @throws {ThreadletAPIError}
	 */
	async getForums(): Promise<Forum[]> {
		const data = await this.get("/forums")
		Forum.array().parse(data)

		return data
	}

	/**
	 * Create a new forum
	 * @param forum forum options
	 * @returns the forum
	 * @throws {ThreadletAPIError}
	 */
	async createForum(forum: ForumOptions): Promise<Forum> {
		const data = await this.post("/forums", forum)
		Forum.parse(data)

		return data
	}

	/**
	 * Get a forum from ID
	 * @param forumId id of the forum
	 * @returns the forum
	 * @throws {ThreadletAPIError}
	 */
	async getForum(forumId: string): Promise<Forum> {
		const data = await this.get(`/forums/${forumId}`)
		Forum.parse(data)

		return data
	}

	/**
	 * Get all posts in a forum
	 * @param forumId id of the forum
	 * @returns all posts in the forum
	 * @throws {ThreadletAPIError}
	 */
	async getPosts(forumId: string): Promise<Post[]> {
		const data = await this.get(`/forums/${forumId}/posts`)
		Post.array().parse(data)

		return data
	}

	/**
	 * Create a noew post
	 * @param forumId id of the forum
	 * @param post post options
	 * @returns the post
	 * @throws {ThreadletAPIError}
	 */
	async createPost(forumId: string, post: PostOptions): Promise<Post> {
		const data = await this.post(`/forums/${forumId}/posts`, post)
		Post.parse(data)

		return data
	}

	/**
	 * Get a user
	 * @param userId id of the user
	 * @returns the user
	 * @throws {ThreadletAPIError}
	 */
	async getUser(userId: string): Promise<User> {
		const data = await this.get(`/users/${userId}`)
		User.parse(data)

		return data
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
		const data = await this.post(`/forums/${forumId}/posts/${postId}/messages`, msg)
		Message.parse(data)

		return data
	}

	/**
	 * Get all messages on a post
	 * @param forumId id of the forum
	 * @param postId id of the post
	 * @returns all messages on the post
	 */
	async getMessages(forumId: string, postId: string): Promise<Message[]> {
		const data = await this.get(`/forums/${forumId}/posts/${postId}/messages`)
		Message.array().parse(data)

		return data
	}

	private get(route: string) {
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
			return data
		})
	}

	private post(route: string, requestBody: any) {
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
			return data
		})
	}

}

/**
 * Options for {@link ThreadletAPI}
 */
export type APIOptions = {
	API_ROOT: string
}

const defaultOptions: APIOptions = {
	API_ROOT: "/.proxy/api"
}
