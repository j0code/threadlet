import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";

export default class UnknownEvent extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = markdownToHtml(this.message.getType() + "\n```json\n" + JSON.stringify(this.message.getContent()) + "\n```")
		super.reset()
	}
}