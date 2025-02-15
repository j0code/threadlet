import { Forum } from "../api/types"
import { api, app, views } from "../main"
import FormButton from "./FormButton"
import PostPreviewGrid from "./PostPreviewGrid"
import View from "./View"

export default class ForumView extends View {

	private currentForumId?: string

	public readonly titleElement: HTMLSpanElement
	public readonly previews: PostPreviewGrid

	constructor() {
		super("div", "forum-view")
		this.element.classList.add("view")

		this.titleElement = document.createElement("span")
		this.titleElement.className = "forum-name"
		this.titleElement.textContent = "POST"
		this.element.appendChild(this.titleElement)

		const createPostBtn = new FormButton("create-post-button", "(+) New Post", async () => {
			if (this.currentForumId) {
				const forum = await api.getForum(this.currentForumId)

				app.renderView(views.postCreateForm, forum)
			}
		})
		this.element.appendChild(createPostBtn.element)

		this.previews = new PostPreviewGrid()
		this.element.appendChild(this.previews.element)
	}

	async reset(forum: Forum) {
		this.titleElement.textContent = forum.name

		this.previews.reset(forum)

		this.currentForumId = forum.id
	}

}
