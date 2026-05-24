import Component from "./Component"

export default class PostPreviewGrid extends Component {
	constructor() {
		super("div", { id: "post-previews" })
	}

	async reset(_forum: unknown) {
		/*
		const posts = await api.getPosts(forum.id)

		for (const child of Array.from(this.element.children)) {
			child.remove()
		}

		for (const post of posts) {
			const preview = new PostPreview(post)
			//preview.element.addEventListener("click", () => app.renderView(views.forumView, forum))
			this.element.appendChild(preview.element)
		}
			*/
	}
}
