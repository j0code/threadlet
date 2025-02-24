import { Forum } from "../api/types"
import { api, app, views } from "../main"
import Form from "./Form"
import FormButton from "./FormButton"
import FormTextarea from "./FormTextarea"
import FormTextInput from "./FormTextInput"

export default class PostCreateForm extends Form {

	private currentForumId?: string

	readonly nameInput: FormTextInput
	readonly descriptionInput: FormTextarea

	constructor() {
		super("Create Post", { id: "post-create-view", classes: ["view"] } )

		this.nameInput = new FormTextInput("post-name", "Post Name", 0, 128)
		this.descriptionInput = new FormTextarea("post-description", "Post Description", 0, 4096)
		const submitButton = new FormButton("post-submit", "Post", () => {
			if (this.currentForumId) {
				submit(this.currentForumId, this)
			}
		})

		this.body.appendChild(this.nameInput.element)
		this.body.appendChild(this.descriptionInput.element)
		this.body.appendChild(submitButton.element)
	}

	reset(forum: Forum) {
		this.titleElement.textContent = `(${forum.name}) Create Post`
		this.nameInput.clear()
		this.descriptionInput.clear()

		this.currentForumId = forum.id
	}

}

async function submit(forumId: string, form: PostCreateForm) {
	const name        = form.nameInput.value
	const description = form.descriptionInput.value
	if (!name || !description) return

	console.log("Create Post:", name)
	const post = await api.postPost(forumId, { name, description })
	console.log("Done. Post:", post)

	app.renderView(views.postView, post)
}
