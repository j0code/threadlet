import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import MXCImage from "../MXCImage"

export default class RoomImageMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""
		const img = new MXCImage(this.message.getContent().url || "")
		await img.reset()
		this.contentElement.appendChild(img.element)
		await super.reset()
	}
}
