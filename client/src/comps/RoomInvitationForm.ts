import { Room } from "matrix-js-sdk"
import { matrix } from "../matrix"
import { app, views } from "../main"
import Form from "./Form"
import SubmitButton from "./SubmitButton"

export default class RoomInvitationForm extends Form {
	room: Room | null = null

	constructor() {
		super("Room Invite", { id: "room-invite-view" })
	}

	reset(room: Room): void {
		this.room = room
		this.titleElement.textContent = `You've been invited to join ${room.name}!`
		this.body.innerHTML = ""
		const joinButton = new SubmitButton("join-room-button", "Join");
		this.body.appendChild(joinButton.element)

		const declineButton = new SubmitButton("decline-room-button", "Decline");
		this.body.appendChild(declineButton.element)
	}

	async submit(id: string) {
		if(!this.room) return;

		if(id === "join-room-button") {
			await matrix.joinRoom(this.room.roomId)
			await matrix.roomInitialSync(this.room.roomId, 20)
			app.renderView(views.roomView, this.room)
		} else if(id === "decline-room-button") {
			await matrix.leave(this.room.roomId)
			app.clearView()
			app.updateChannelList()
		}
	}
}
