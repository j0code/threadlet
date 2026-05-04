import { Room } from "matrix-js-sdk";
import Form from "./Form";
import FormTextInput from "./FormTextInput";
import { matrix } from "../matrix";

export default class RoomInviteForm extends Form {
	constructor() {
		super("Invite to Room", { id: "roomInviteForm" })
	}

	reset(room: Room): void {
		this.titleElement.textContent = `Invite to ${room.name || room.roomId}`
		const userInput = new FormTextInput("roomInviteUser", "MXID")
		this.body.appendChild(userInput.element)

		const inviteButton = document.createElement("button")
		inviteButton.textContent = "Invite"
		inviteButton.type = "submit"
		this.body.appendChild(inviteButton)

		inviteButton.addEventListener("click", async () => {
			await matrix.invite(room.roomId, userInput.value)
			userInput.clear()
			this.element.dispatchEvent(new Event("submit"))
		})
	}
}
