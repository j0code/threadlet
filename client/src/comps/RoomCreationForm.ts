import { Forum } from "@j0code/threadlet-api/v0/types"
import { api, app, views } from "../main"
import Form from "./Form"
import FormButton from "./FormButton"
import FormTextInput from "./FormTextInput"
import FormInputList from "./FormInputList"
import { Room } from "matrix-js-sdk"
import { matrix } from "../matrix"
import FormCheckbox from "./FormCheckbox"

export default class RoomCreationForm extends Form {

	readonly nameInput: FormTextInput
	readonly topicInput: FormTextInput
	readonly unfederateInput: FormCheckbox

	constructor() {
		super(`Create Room`, { id: "room-creation-view", classes: ["view"] })

		this.nameInput = new FormTextInput("room-name", "Room Name", 0, 64, true)
		this.topicInput = new FormTextInput("room-topic", "Room Topic", 0, 128, true)
		this.unfederateInput = new FormCheckbox("room-unfederate", "Disable Federation (cannot be undone)")
		const submitButton = new FormButton("room-submit", "Create", () => this.submit())

		this.body.appendChild(this.nameInput.element)
		this.body.appendChild(this.topicInput.element)
		this.body.appendChild(this.unfederateInput.element)
		this.body.appendChild(submitButton.element)
	}

	reset() {
		this.nameInput.clear()
	}

	async submit() {
		const res = await matrix.createRoom({
			name: this.nameInput.value,
			topic: this.topicInput.value == "" ? undefined : this.topicInput.value,
			creation_content: this.unfederateInput.value ? {
				"m.federate": false
			} : undefined
		})
		console.log("Room created with ID", res.room_id)
		await matrix.roomInitialSync(res.room_id, 20)
		app.updateChannelList()
		app.renderView(views.roomView, matrix.getRoom(res.room_id))
	}

}
