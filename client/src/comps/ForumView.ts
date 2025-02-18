import { Forum } from "../api/types"
import { api, app, views } from "../main"
import FormButton from "./FormButton"
import PostPreviewGrid from "./PostPreviewGrid"
import View from "./View"
import ViewHead from "./ViewHead"

export default class ForumView extends View {

	private currentForumId?: string

	public readonly head: ViewHead
	public readonly previews: PostPreviewGrid

	constructor() {
		super("div", "forum-view", "view")

		this.head = new ViewHead("FORUM")
		this.element.appendChild(this.head.element)

		const createPostBtn = new FormButton("create-post-button", "(+) New Post", async () => {
			if (this.currentForumId) {
				console.log("forumId:", this.currentForumId)
				const forum = await api.getForum(this.currentForumId)

				app.renderView(views.postCreateForm, forum)
			}
		})
		this.element.appendChild(createPostBtn.element)

		this.previews = new PostPreviewGrid()
		this.element.appendChild(this.previews.element)
	}

	async reset(forum: Forum) {
		this.head.reset(forum.name)
		this.previews.reset(forum)

		this.currentForumId = forum.id
	}

}
