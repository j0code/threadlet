import { Room } from "matrix-js-sdk";
import View from "./View";
import { matrix } from "../matrix";
import { app, views } from "../main";
import App from "./App";

export default class RoomInviteView extends View {
	constructor() {
		super("Room Invite", { id: "room-invite-view" })
	}

	reset(room: Room): void {
		this.head.titleElement.textContent = `You've been invited to join ${room.name}!`
		this.body.innerHTML = ""
		const joinButton = document.createElement("button")
		joinButton.textContent = "Join"
		joinButton.addEventListener("click", async () => {
			await matrix.joinRoom(room.roomId)
			await matrix.roomInitialSync(room.roomId, 20)
			let _app = app as App
			_app.renderView(views.roomView, room)
			_app.updateMemberList(room)
		})
		this.body.appendChild(joinButton)
		const declineButton = document.createElement("button")
		declineButton.textContent = "Decline"
		declineButton.addEventListener("click", async () => {
			await matrix.leave(room.roomId)
			let _app = app as App
			_app.renderView(undefined)
			_app.updateMemberList(null)
			_app.updateChannelList()
		})
		this.body.appendChild(declineButton)
	}
}