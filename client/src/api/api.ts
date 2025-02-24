import ThreadletAPIError from "./ThreadletAPIError"
import { type User, type Forum, type Post } from "./types"

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

	postForum(forum: Omit<Forum, "id" | "created_at">): Promise<Forum> {
		return post("/forums", this.access_token, forum) // TODO: proper parsing
	}

	getForum(forumId: string): Promise<Forum> {
		return get(`/forums/${forumId}`, this.access_token) // TODO: proper parsing
	}

	getPosts(forumId: string): Promise<Post[]> {
		return get(`/forums/${forumId}/posts`, this.access_token) // TODO: proper parsing
	}

	postPost(forumId: string, _post: Omit<Post, "id" | "created_at" | "forum_id" | "poster_id">): Promise<Post> {
		return post(`/forums/${forumId}/posts`, this.access_token, _post) // TODO: proper parsing
	}

	getUser(userId: string): Promise<User> {
		return get(`/users/${userId}`, this.access_token) // TODO: proper parsing
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
