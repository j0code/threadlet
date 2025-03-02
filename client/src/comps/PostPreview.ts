import { Post } from "@j0code/threadlet-api/v0/types"
import { app, views } from "../main"
import Component from "./Component"

export default class PostPreview extends Component {

	readonly post: Post

	constructor(post: Post) {
		super("div", { id: `post-preview-${post.id}`, classes: ["post-preview"] })

		this.post = post

		const titleElement = document.createElement("span")
		titleElement.className = "post-preview-title"
		titleElement.textContent = this.post.name

		const descriptionElement = document.createElement("span")
		descriptionElement.className = "post-preview-description"
		descriptionElement.textContent = this.post.description

		this.element.appendChild(titleElement)
		this.element.appendChild(descriptionElement)
		this.element.addEventListener("click", () => {
			app.renderView(views.postView, this.post)
		})
	}

}
