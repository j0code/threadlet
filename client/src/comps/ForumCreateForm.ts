import { api, app, views } from "../main"
import Form from "./Form"
import FormButton from "./FormButton"
import FormTextInput from "./FormTextInput"

export default class ForumCreateForm extends Form {

	readonly nameInput: FormTextInput

	constructor() {
		super("Create Forum", { id: "forum-create-view" , classes: ["view"] })

		this.nameInput = new FormTextInput("forum-name", "Forum Name", 0, 64)
		const submitButton = new FormButton("form-submit", "Create", () => submit(this))

		this.body.appendChild(this.nameInput.element)
		this.body.appendChild(submitButton.element)
	}

	reset() {
		this.nameInput.clear()
	}

}

async function submit(form: ForumCreateForm) {
	const name = form.nameInput.value
	if (!name) return

	console.log("Create Forum:", name)
	const forum = await api.postForum({ name })
	console.log("Done. Forum:", forum)

	app.renderView(views.forumView, forum)
}
