import { api } from "../main"
import Form from "./Form"
import FormButton from "./FormButton"
import FormTextInput from "./FormTextInput"

export default class ForumCreateForm extends Form {

	readonly nameInput: FormTextInput

	constructor() {
		super("forum-create-view", "Create Forum")
		this.element.classList.add("view")

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
}
