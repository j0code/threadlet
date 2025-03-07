import { Forum } from "@j0code/threadlet-api/v0/types"
import { api, app, views } from "../main"
import FormButton from "./FormButton"
import PostPreviewGrid from "./PostPreviewGrid"
import View from "./View"

export default class ForumView extends View {

	private currentForumId?: string

	public readonly previews: PostPreviewGrid

	constructor() {
		super("FORUM", { id: "forum-view" })

		const createPostBtn = new FormButton("create-post-button", "(+) New Post", async () => {
			if (this.currentForumId) {
				console.log("forumId:", this.currentForumId)
				const forum = await api.getForum(this.currentForumId)

				app.renderView(views.postCreateForm, forum)
			}
		})
		this.body.appendChild(createPostBtn.element)

		this.previews = new PostPreviewGrid()
		this.body.appendChild(this.previews.element)
	}

	async reset(forum: Forum) {
		this.head.reset(forum.name)
		this.previews.reset(forum)

		this.currentForumId = forum.id
	}

}
