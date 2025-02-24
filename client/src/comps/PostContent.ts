import { Post } from "../api/types"
import { markdownToHtml } from "../md"
import Author from "./PostAuthor"
import Component from "./Component"

export default class PostContent extends Component {

	readonly currentPostId: string | undefined

	readonly descriptionElement: HTMLDivElement

	constructor() {
		super("div", { id: "post-content" })

		this.descriptionElement = document.createElement("div")
		this.descriptionElement.className = "post-description md"

		this.element.appendChild(this.descriptionElement)
	}

	reset(post: Post) {
		if (post.id == this.currentPostId) return
		this.descriptionElement.innerHTML = markdownToHtml(post.description)
	}

}
