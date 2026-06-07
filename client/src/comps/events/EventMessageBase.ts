import { MatrixEvent } from "matrix-js-sdk"
import EventBase from "./EventBase"
import { relativeTimeFormat } from "../../intl"
import { type SupportedStateEvents } from "../../schemas/ClientEvent"

export default class EventMessageBase<
	Type extends SupportedStateEvents,
> extends EventBase<Type> {
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
		this.timestampElement.dateTime = msg.getDate()?.toISOString() || ""
		// this.timestampElement.textContent = msg.getDate()?.toISOString() || ""
		this.timestampElement.textContent = relativeTimeFormat(
			msg.getDate() || new Date()
		)
	}
}
