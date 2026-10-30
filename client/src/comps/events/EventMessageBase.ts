import { MatrixEvent } from "matrix-js-sdk"
import EventBase from "./EventBase"
import { relativeTimeFormat } from "../../intl"
import { getEventTimestamp } from "./Event"

export default class EventMessageBase extends EventBase {
	constructor(msg: MatrixEvent) {
		super(msg, "div", { id: `message-${msg.getId()}`, classes: ["message"] })

		this.mainElement.className = "message-main"
		this.mainElement.append(
			this.avatar.element,
			this.contentElement,
			this.timestampElement
		)

		void this.reset()
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async reset() {
		const msg = this.message
		this.timestampElement.dateTime = getEventTimestamp(msg).toISOString() || ""
		// this.timestampElement.textContent = msg.getDate()?.toISOString() || ""
		this.timestampElement.textContent = relativeTimeFormat(
			getEventTimestamp(msg) || new Date()
		)
	}
}
