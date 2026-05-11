import { MatrixEvent } from "matrix-js-sdk"
import { markdownToHtml, twemojiParse } from "../../md"
import { purifyHTML } from "./HTMLFormat"
import { parseEventContent } from "../../events"
import ChatMessageBase from "./ChatMessageBase"
import { getMXUser } from "../../matrix"

export default class RoomEmoteMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		const { mxid, displayname } = await getMXUser(this.message.getSender()!)
		this.contentElement.innerHTML = ""

		const emote = document.createElement("span")
		emote.innerHTML = twemojiParse(
			displayname || mxid || "Unknown"
		)
		emote.className = "emote"
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
