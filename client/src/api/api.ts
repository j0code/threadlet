const API_ROOT = "/.proxy/api"

export default class ThreadletAPI {

	constructor() {

	}

	getForums(): Promise<Forum[]> {
		return get("/forums") // TODO: proper parsing
	}

	postForum(forum: Omit<Forum, "id" | "created_at">) {
		return post("/forums", forum)
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

type Forum = {
	id: string,
	name: string,
	created_at: string
}
