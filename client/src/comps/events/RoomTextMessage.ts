import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { matrix } from "../../matrix";
import MXCImage from "../MXCImage";
import { purifyHTML } from "./HTMLFormat";

export default class RoomTextMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		switch (this.message.getContent().format) {
			case "org.matrix.custom.html":
				this.contentElement.innerHTML = purifyHTML(this.message.getContent().formatted_body || "")
				break
			case "org.matrix.custom.markdown": // This is not official, but its useful. Should it be renamed to something else because its not official?
				this.contentElement.innerHTML = markdownToHtml(this.message.getContent().body || "")
				break
			case undefined:
			default:
				this.contentElement.innerText = this.message.getContent().body || ""
				break
		}
		super.reset()
	}
}