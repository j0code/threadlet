import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { getMXCData } from "../../matrix"
import { parseEventContent } from "../../events"

export default class RoomAudioMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""

		const content = parseEventContent(this.message.getContent())
		const blobUrl =
			typeof content.url == "string" ? await getMXCData(content.url) : null

		const audio = document.createElement("audio")
		audio.controls = true
		if (blobUrl) audio.src = blobUrl
		this.contentElement.appendChild(audio)
		await super.reset()
	}
}
