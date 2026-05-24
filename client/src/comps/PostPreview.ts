import Component from "./Component"

export default class PostPreview extends Component {
	readonly post: unknown

	/*constructor(post: unknown) {
		super("div", { id: `post-preview-${post.id}`, classes: ["post-preview"] })

		this.post = post

		const titleElement = document.createElement("span")
		titleElement.className = "post-preview-title"
		titleElement.innerHTML = twemojiParse(this.post.name)

		const descriptionElement = document.createElement("span")
		descriptionElement.className = "post-preview-description"
		descriptionElement.textContent = this.post.description

		this.element.appendChild(titleElement)
		this.element.appendChild(descriptionElement)
		this.element.addEventListener("click", () => {
			app.renderView(views.postView, this.post.id)
		})
	}*/
}
