import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { markdownToHtml } from "../../md"
import { UNKNOWN_EVENT_KEY } from "../../schemas/ClientEvent"

export default class UnknownEvent extends ChatMessageBase<typeof UNKNOWN_EVENT_KEY> {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = markdownToHtml(
			this.message.getType() +
				"\n```json\n" +
				JSON.stringify(this.message.getContent(), undefined, "  ") +
				"\n```"
		)
		await super.reset()
	}

	get type() {
		return UNKNOWN_EVENT_KEY
	}
}
