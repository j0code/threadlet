import { MatrixEvent } from "matrix-js-sdk"
import EventMessageBase from "./EventMessageBase"
import { getMXUser } from "../../matrix"
import { twemojiParse } from "../../md"

export default class RoomNameEvent extends EventMessageBase<"m.room.name"> {
	constructor(msg: MatrixEvent) {
		super(msg)
		void this.reset()
	}

	async reset() {
		await super.reset()

		const { mxid, displayname } = await getMXUser(this.message.getSender()!)
		const authorName = twemojiParse(displayname || mxid || "Unknown User")

		const roomName = twemojiParse(this.content.name || "Unknown")

		this.nameElement.innerHTML = authorName
		this.contentElement.innerHTML = `<span>changed the room name to ${roomName}</span>`
		this.contentElement.prepend(this.nameElement)
	}
}
