import ThreadletAPIError from "./ThreadletAPIError.js"
import { type User, type Forum, type Post, type ForumOptions, type PostOptions, type MessageOptions, type Message } from "./types.js"

const API_ROOT = "/.proxy/api"
const CDN_URL  = "https://cdn.discordapp.com"

export default class ThreadletAPI {

	private readonly access_token: string

	constructor(access_token: string) {
		this.access_token = access_token
	}

	getForums(): Promise<Forum[]> {
		return get("/forums", this.access_token) // TODO: proper parsing
	}

	createForum(forum: ForumOptions): Promise<Forum> {
		return post("/forums", this.access_token, forum) // TODO: proper parsing
	}

	getForum(forumId: string): Promise<Forum> {
		return get(`/forums/${forumId}`, this.access_token) // TODO: proper parsing
	}

	getPosts(forumId: string): Promise<Post[]> {
		return get(`/forums/${forumId}/posts`, this.access_token) // TODO: proper parsing
	}

	createPost(forumId: string, _post: PostOptions): Promise<Post> {
		return post(`/forums/${forumId}/posts`, this.access_token, _post) // TODO: proper parsing
	}

	getUser(userId: string): Promise<User> {
		return get(`/users/${userId}`, this.access_token) // TODO: proper parsing
	}

	createMessage(forumId: string, postId: string, msg: MessageOptions): Promise<Message> {
		return post(`/forums/${forumId}/posts/${postId}/messages`, this.access_token, msg) // TODO: proper parsing
	}

	getMessages(forumId: string, postId: string): Promise<Message[]> {
		return get(`/forums/${forumId}/posts/${postId}/messages`, this.access_token) // TODO: proper parsing
	}

}

function get(route: string, token: string) {
	return fetch(`${API_ROOT}${route}`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`
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

function post(route: string, token: string, requestBody: any) {
	return fetch(`${API_ROOT}${route}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
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
