import { MatrixEvent } from "matrix-js-sdk"
import { markdownToHtml } from "../../md"
import { matrix } from "../../matrix"
import EventMessageBase from "./EventMessageBase"
import { purifyHTML } from "./HTMLFormat"
import { parseEventContent } from "../../events"

export default class RoomEmoteMessage extends EventMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		const sender = matrix.getUser(this.message.getSender()!)
		this.contentElement.innerHTML = ""

		const emote = document.createElement("span")
		emote.innerText = "* " + (sender?.displayName || this.message.getSender())
		this.contentElement.appendChild(emote)

		const body = document.createElement("span")
		const content = parseEventContent(this.message.getContent())

		switch (this.message.getContent().format) {
			case "org.matrix.custom.html":
				body.innerHTML = purifyHTML(content.formatted_body ?? "")
				break
			case "org.matrix.custom.markdown": // This is not official, but its useful. Should it be renamed to something else because its not official?
				body.innerHTML = markdownToHtml(content.body || "")
				break
			case undefined:
			default:
				body.innerText = content.body || ""
				break
		}

		this.contentElement.appendChild(body)
		await super.reset()
	}
}
