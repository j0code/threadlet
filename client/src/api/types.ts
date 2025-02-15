export type Forum = {
	id: string,
	name: string,
	created_at: string
}

export type Post = {
	id: string,
	forum_id: string,
	name: string,
	description: string,
	created_at: string
}
