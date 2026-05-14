import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { getMXCData } from "../../matrix"
import { parseEventContent } from "../../events"

export default class RoomVideoMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""

		const content = parseEventContent(this.message.getContent())
		const blobUrl =
			typeof content.url == "string" ? await getMXCData(content.url) : null

		const video = document.createElement("video")
		video.controls = true
		if (blobUrl) video.src = blobUrl
		this.contentElement.appendChild(video)
		await super.reset()
	}
}
