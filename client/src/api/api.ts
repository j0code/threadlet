import { type Forum, type Post } from "./types"

const API_ROOT = "/.proxy/api"

export default class ThreadletAPI {

	constructor() {

	}

	getForums(): Promise<Forum[]> {
		return get("/forums") // TODO: proper parsing
	}

	postForum(forum: Omit<Forum, "id" | "created_at">): Promise<Forum> {
		return post("/forums", forum) // TODO: proper parsing
	}

	getForum(forumId: string): Promise<Forum[]> {
		return get(`/forums/${forumId}`) // TODO: proper parsing
	}

	getPosts(forumId: string): Promise<Post[]> {
		return get(`/forums/${forumId}/posts`) // TODO: proper parsing
	}

	postPost(forumId: string, _post: Omit<Post, "id" | "created_at" | "forum_id">): Promise<Post> {
		return post(`/forums/${forumId}/posts`, _post) // TODO: proper parsing
	}

}

function get(route: string) {
	return fetch(`${API_ROOT}${route}`).then(res => res.json())
}

function post(route: string, data: any) {
	return fetch(`${API_ROOT}${route}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}).then(res => res.json())
}
