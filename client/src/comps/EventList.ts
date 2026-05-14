import Component from "./Component"
import { MatrixEvent } from "matrix-js-sdk"
import { renderEvent } from "./events/Event"

export default class EventList extends Component {
	constructor() {
		super("div", { id: `events` })
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
		const autoscroll =
			this.element.scrollTop + this.element.clientHeight >=
			this.element.scrollHeight - 10

		const comp = renderEvent(event)
		this.element.appendChild(comp.element)

		if (autoscroll) {
			this.element.scrollTo({
				top: this.element.scrollHeight,
				behavior: "smooth",
			})
		}
	}
}
