import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { matrix } from "../../matrix";
import MXCImage from "../MXCImage";
import EventMessageBase from "./EventMessageBase";
import { purifyHTML } from "./HTMLFormat";

export default class RoomEmoteMessage extends EventMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		const sender = matrix.getUser(this.message.getSender()!)
		this.contentElement.innerHTML = ""
		this.contentElement.style.display = "flex"
		this.contentElement.style.gap = "1ch"
		const emote = document.createElement("span")
		emote.innerText = "* " + (sender?.displayName || this.message.getSender())
		this.contentElement.appendChild(emote)
		const body = document.createElement("span")
		switch (this.message.getContent().format) {
			case "org.matrix.custom.html":
				body.innerHTML = purifyHTML(this.message.getContent().formatted_body || "")
				break
			case "org.matrix.custom.markdown": // This is not official, but its useful. Should it be renamed to something else because its not official?
				body.innerHTML = markdownToHtml(this.message.getContent().body || "")
				break
			case undefined:
			default:
				body.innerHTML = this.message.getContent().body || ""
				break
		}
		this.contentElement.appendChild(body)
		super.reset()
	}
}