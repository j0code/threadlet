import { Room } from "matrix-js-sdk"
import { matrix } from "../matrix"
import { app, views } from "../main"
import Form from "./Form"

export default class RoomInvitationForm extends Form {
	constructor() {
		super("Room Invite", { id: "room-invite-view" })
	}

	reset(room: Room): void {
		this.titleElement.textContent = `You've been invited to join ${room.name}!`
		this.body.innerHTML = ""
		const joinButton = document.createElement("button")
		joinButton.textContent = "Join"
		joinButton.addEventListener("click", async () => {
			await matrix.joinRoom(room.roomId)
			await matrix.roomInitialSync(room.roomId, 20)
			app.renderView(views.roomView, room)
			this.element.dispatchEvent(new Event("submit"))
		})
		this.body.appendChild(joinButton)
		const declineButton = document.createElement("button")
		declineButton.textContent = "Decline"
		declineButton.addEventListener("click", async () => {
			await matrix.leave(room.roomId)
			app.clearView()
			app.updateChannelList()
			this.element.dispatchEvent(new Event("submit"))
		})
		this.body.appendChild(declineButton)
	}
}
