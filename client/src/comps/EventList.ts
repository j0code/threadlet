import Component from "./Component"
import { MatrixEvent } from "matrix-js-sdk"
import { renderEvent } from "./events/Event"
import ChatMessageBase from "./events/ChatMessageBase"
import EventMessageBase from "./events/EventMessageBase"
import { type SupportedStateEvents } from "../schemas/ClientEvent"

const HIDDEN_EVENTS = ["m.room.redaction"]

export default class EventList extends Component {
	eventComponents: Map<string, ChatMessageBase | EventMessageBase<SupportedStateEvents>>

	constructor() {
		super("div", { id: `events` })
		this.eventComponents = new Map()
	}

	reset(events: MatrixEvent[]) {
		for (const child of Array.from(this.element.children)) {
			child.remove()
		}

		for (const event of events) {
			this.pushMessage(event)
		}

		this.element.scrollTop = this.element.scrollHeight
	}

	pushMessage(event: MatrixEvent) {
		if (HIDDEN_EVENTS.includes(event.getType())) return

		const autoscroll =
			this.element.scrollTop + this.element.clientHeight >=
			this.element.scrollHeight - 10

		const comp = renderEvent(event)
		this.eventComponents.set(event.getId()!, comp)
		this.element.appendChild(comp.element)

		if (autoscroll) {
			this.element.scrollTo({
				top: this.element.scrollHeight,
				behavior: "smooth",
			})
		}
	}
}
