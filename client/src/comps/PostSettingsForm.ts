import { Forum, Post } from "@j0code/threadlet-api/v0/types"
import { api, app, views } from "../main"
import Form from "./Form"
import FormButton from "./FormButton"
import FormTextarea from "./FormTextarea"
import FormTextInput from "./FormTextInput"
import { twemojiParse } from "../md"
import FormMultiSelect, { FormMultiSelectOption } from "./FormMultiSelect"

export default class PostSettingsForm extends Form {

	private currentForumId?: string

	readonly nameInput: FormTextInput
	readonly descriptionInput: FormTextarea
	readonly tagSelect: FormMultiSelect

	constructor(post?: Post, forum?: Forum) {
		super(`${post ? "Edit" : "Create"} Post`, { id: "post-settings-view", classes: ["view"] } )

		let options: FormMultiSelectOption[] = []
		if (forum?.tags) {
			options = forum.tags.map(tag => ({ id: tag.id, label: tag.name }))
		}

		this.nameInput = new FormTextInput("post-name", "Post Name", 0, 128, true)
		this.descriptionInput = new FormTextarea("post-description", "Post Description", 0, 16384, true)
		this.tagSelect = new FormMultiSelect({ options, placeholder: "Wow!" })
		const submitButton = new FormButton("post-submit", post ? "Save" : "Post", () => {
			if (this.currentForumId) {
				submit(this.currentForumId, this)
			}
		})

		this.body.appendChild(this.nameInput.element)
		this.body.appendChild(this.descriptionInput.element)
		this.body.appendChild(this.tagSelect.element)
		this.body.appendChild(submitButton.element)
	}

	reset(forum: Forum) {
		this.titleElement.innerHTML = `(${twemojiParse(forum.name)}) Create Post`
		this.nameInput.clear()
		this.descriptionInput.clear()
		this.tagSelect.clear()

		let options: FormMultiSelectOption[] = []
		if (forum?.tags) {
			options = forum.tags.map(tag => ({ id: tag.id, label: tag.name }))
		}
		this.tagSelect.setOptions(options)

		this.currentForumId = forum.id
	}

}

async function submit(forumId: string, form: PostSettingsForm) {
	const name        = form.nameInput.value
	const description = form.descriptionInput.value
	const tags        = form.tagSelect.value
	if (!name || !description) return

	console.log("Create Post:", name, tags)
	const post = await api.createPost(forumId, { name, description, tags })
	console.log("Done. Post:", post)

	app.renderView(views.postView, post)
}
