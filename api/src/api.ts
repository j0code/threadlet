import ThreadletAPIError from "./ThreadletAPIError.js"
import { type User, type Forum, type Post, type ForumOptions, type PostOptions, type MessageOptions, type Message } from "./types.js"

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
	getForums(): Promise<Forum[]> {
		return this.get("/forums") // TODO: proper parsing
	}

	/**
	 * Create a new forum
	 * @param forum forum options
	 * @returns the forum
	 * @throws {ThreadletAPIError}
	 */
	createForum(forum: ForumOptions): Promise<Forum> {
		return this.post("/forums", forum) // TODO: proper parsing
	}

	/**
	 * Get a forum from ID
	 * @param forumId id of the forum
	 * @returns the forum
	 * @throws {ThreadletAPIError}
	 */
	getForum(forumId: string): Promise<Forum> {
		return this.get(`/forums/${forumId}`) // TODO: proper parsing
	}

	/**
	 * Get all posts in a forum
	 * @param forumId id of the forum
	 * @returns all posts in the forum
	 * @throws {ThreadletAPIError}
	 */
	getPosts(forumId: string): Promise<Post[]> {
		return this.get(`/forums/${forumId}/posts`) // TODO: proper parsing
	}

	/**
	 * Create a noew post
	 * @param forumId id of the forum
	 * @param post post options
	 * @returns the post
	 * @throws {ThreadletAPIError}
	 */
	createPost(forumId: string, post: PostOptions): Promise<Post> {
		return this.post(`/forums/${forumId}/posts`, post) // TODO: proper parsing
	}

	/**
	 * Get a user
	 * @param userId id of the user
	 * @returns the user
	 * @throws {ThreadletAPIError}
	 */
	getUser(userId: string): Promise<User> {
		return this.get(`/users/${userId}`) // TODO: proper parsing
	}

	/**
	 * Create a new message
	 * @param forumId id of the forum
	 * @param postId id of the post
	 * @param msg message options
	 * @returns the message
	 * @throws {ThreadletAPIError}
	 */
	createMessage(forumId: string, postId: string, msg: MessageOptions): Promise<Message> {
		return this.post(`/forums/${forumId}/posts/${postId}/messages`, msg) // TODO: proper parsing
	}

	/**
	 * Get all messages on a post
	 * @param forumId id of the forum
	 * @param postId id of the post
	 * @returns all messages on the post
	 */
	getMessages(forumId: string, postId: string): Promise<Message[]> {
		return this.get(`/forums/${forumId}/posts/${postId}/messages`) // TODO: proper parsing
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
