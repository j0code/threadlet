import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { markdownToHtml } from "../../md"
import { purifyHTML } from "./HTMLFormat"
import { parseEventContent } from "../../events"

export default class RoomTextMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		const content = parseEventContent(this.message.getContent())

		switch (this.message.getContent().format) {
			case "org.matrix.custom.html":
				this.contentElement.innerHTML = purifyHTML(content.formatted_body || "")
				break
			case "org.matrix.custom.markdown": // This is not official, but its useful. Should it be renamed to something else because its not official?
				this.contentElement.innerHTML = markdownToHtml(content.body || "")
				break
			case undefined:
			default:
				this.contentElement.innerText = content.body || ""
				break
		}
		await super.reset()
	}
}
