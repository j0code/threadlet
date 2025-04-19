import { Forum } from "@j0code/threadlet-api/v0/types"
import { api, app, views } from "../main"
import Form from "./Form"
import FormButton from "./FormButton"
import FormTextInput from "./FormTextInput"
import FormInputList from "./FormInputList"

export default class ForumSettingsForm extends Form {

	readonly forum?: Forum

	readonly nameInput: FormTextInput
	readonly tagsInput: FormInputList

	constructor(forum?: Forum) {
		super(`${forum ? "Edit" : "Create"} Forum`, { id: "forum-settings-view" , classes: ["view"] })
		this.forum = forum

		this.nameInput = new FormTextInput("forum-name", "Forum Name", 0, 64, true)
		this.tagsInput = new FormInputList("forum-tags")
		const submitButton = new FormButton("form-submit", forum ? "Save" : "Create", () => submit(this))

		this.body.appendChild(this.nameInput.element)
		this.body.appendChild(this.tagsInput.element)
		this.body.appendChild(submitButton.element)
	}

	reset() {
		this.nameInput.clear()
	}

}

async function submit(form: ForumSettingsForm) {
	const name = form.nameInput.value
	if (!name) return
	const tags = form.tagsInput.value

	console.log("Create Forum:", name, tags)
	const forum = await api.createForum({ name, tags: tags.map(name => ({emoji: "", name})) })
	console.log("Done. Forum:", forum)

	app.renderView(views.forumView, forum)
}
