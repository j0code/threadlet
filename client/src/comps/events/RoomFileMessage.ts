import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { getMXCData } from "../../matrix"
import { File } from "../../schemas/msgtypes/m/File"

export default class RoomFileMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""

		const content = this.content as File

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
