import { Room } from "matrix-js-sdk"
import Form from "./Form"
import FormTextInput from "./FormTextInput"
import { matrix } from "../matrix"
import FormButton from "./FormButton"

export default class RoomInviteForm extends Form {
	constructor() {
		super("Invite to Room", { id: "room-invite-form" })
	}

	reset(room: Room): void {
		this.body.innerHTML = ""
		this.titleElement.textContent = `Invite to ${room.name || room.roomId}`
		const userInput = new FormTextInput("room-invite-user", "MXID", 1, 255)
		this.body.appendChild(userInput.element)

		const inviteButton = new FormButton("room-invite-button", "Invite", async () => {
			await matrix.invite(room.roomId, userInput.value)
			userInput.clear()
			this.element.dispatchEvent(new Event("submit"))
		}, "submit")
		this.body.appendChild(inviteButton.element)
	}
}
