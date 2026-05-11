import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { getMXCData } from "../../matrix"
import { parseEventContent } from "../../events"

export default class RoomFileMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""

		const content = parseEventContent(this.message.getContent())
		const blobUrl =
			typeof content.url == "string" ? await getMXCData(content.url) : null

		const file = document.createElement("a")
		if (blobUrl) file.href = blobUrl
		file.target = "_blank"
		file.rel = "noopener noreferrer"
		file.textContent = content.body || "Download File"
		this.contentElement.appendChild(file)
		await super.reset()
	}
}
