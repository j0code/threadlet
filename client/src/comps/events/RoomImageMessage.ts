import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import MXCImage from "../MXCImage"
import { parseEventContent } from "../../events"

export default class RoomImageMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""

		const content = parseEventContent(this.message.getContent())
		const mxcUrl = typeof content.url == "string" ? content.url : ""

		const img = new MXCImage(mxcUrl)
		await img.reset()
		this.contentElement.appendChild(img.element)

		await super.reset()
	}
}
