import { Room } from "matrix-js-sdk"
import { matrix } from "../matrix"
import { app, views } from "../main"
import Form from "./Form"
import FormButton from "./FormButton"

export default class RoomInvitationForm extends Form {
	constructor() {
		super("Room Invite", { id: "room-invite-view" })
	}

	reset(room: Room): void {
		this.titleElement.textContent = `You've been invited to join ${room.name}!`
		this.body.innerHTML = ""
		const joinButton = new FormButton("join-room-button", "Join", async () => {
			await matrix.joinRoom(room.roomId)
			await matrix.roomInitialSync(room.roomId, 20)
			app.renderView(views.roomView, room)
			this.element.dispatchEvent(new Event("submit"))
		}, "submit");
		this.body.appendChild(joinButton.element)

		const declineButton = new FormButton("decline-room-button", "Decline", async () => {
			await matrix.leave(room.roomId)
			app.clearView()
			app.updateChannelList()
			this.element.dispatchEvent(new Event("submit"))
		}, "submit")
		this.body.appendChild(declineButton.element)
	}
}
