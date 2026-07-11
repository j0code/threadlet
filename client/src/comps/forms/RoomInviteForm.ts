import { Room } from "matrix-js-sdk"
import Form from "./Form"
import FormTextInput from "../form-comps/FormTextInput"
import { matrix } from "../../matrix"
import SubmitButton from "../form-comps/SubmitButton"

export default class RoomInviteForm extends Form {
	room: Room | null = null
	userInput!: FormTextInput

	constructor() {
		super("Invite to Room", { id: "room-invite-form" })

		this.userInput = new FormTextInput("room-invite-user", "MXID", 1, 255)
		this.body.appendChild(this.userInput.element)

		const inviteButton = new SubmitButton("room-invite-button", "Invite")
		this.body.appendChild(inviteButton.element)
	}

	reset(room: Room): void {
		this.room = room
		this.titleElement.textContent = `Invite to ${room.name || room.roomId}`
	}

	async submit(id: string) {
		if (id === "room-invite-button" && this.room) {
			await matrix.invite(this.room.roomId, this.userInput.value)
			this.userInput.clear()
		}
	}
}
