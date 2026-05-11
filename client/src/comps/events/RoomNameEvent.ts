import { MatrixEvent } from "matrix-js-sdk"
import EventMessageBase from "./EventMessageBase"
import { getMXUser } from "../../matrix"
import { twemojiParse } from "../../md"
import { parseEventContent } from "../../events"

export default class RoomNameEvent extends EventMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
		void this.reset()
	}

	async reset() {
		await super.reset()

		const { mxid, displayname } = await getMXUser(this.message.getSender()!)
		const authorName = twemojiParse(
			displayname || mxid || "Unknown User"
		)

		const content = parseEventContent(this.message.getContent())
		// @ts-expect-error content.name should be string
		const roomName = twemojiParse(content.name || "Unknown")

		
		this.contentElement.innerHTML = `${authorName} changed the room name to ${roomName}`
	}
}
