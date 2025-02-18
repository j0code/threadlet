import { Post } from "../api/types"
import PostContent from "./PostContent"
import View from "./View"
import ViewHead from "./ViewHead"

export default class PostView extends View {

	private currentPostId?: string

	public readonly head: ViewHead
	public readonly content: PostContent

	constructor() {
		super("div", "post-view", "view")

		this.head = new ViewHead("FORUM")
		this.content = new PostContent()

		this.element.appendChild(this.head.element)
		this.element.appendChild(this.content.element)
	}

	async reset(post: Post) {
		this.head.reset(post.name)
		this.content.reset(post)

		this.currentPostId = post.id
	}

}
