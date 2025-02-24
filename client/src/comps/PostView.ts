import { Post } from "../api/types"
import PostAuthor from "./PostAuthor"
import PostContent from "./PostContent"
import View from "./View"
import { api } from "../main"

export default class PostView extends View {

	private currentPostId?: string

	public readonly content: PostContent
	public readonly author: PostAuthor

	constructor() {
		super("div", { id: "post-view" })

		this.content = new PostContent()
		this.author  = new PostAuthor()

		this.body.appendChild(this.author.element)
		this.body.appendChild(this.content.element)
	}

	async reset(post: Post) {
		this.head.reset(post.name)
		this.content.reset(post)

		const user = await api.getUser(post.poster_id)
		this.author.reset(user)

		this.currentPostId = post.id
	}

}
