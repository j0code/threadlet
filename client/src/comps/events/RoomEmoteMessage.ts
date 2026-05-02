import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { matrix } from "../../matrix";
import MXCImage from "../MXCImage";
import EventMessageBase from "./EventMessageBase";

export default class RoomEmoteMessage extends EventMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		const sender = matrix.getUser(this.message.getSender()!)
		this.contentElement.innerHTML = markdownToHtml("\\* " + (sender?.displayName || this.message.getSender()) + " " + this.message.getContent().body || "```json\n" + JSON.stringify(this.message.getContent()) + "\n```")
		super.reset()
	}
}