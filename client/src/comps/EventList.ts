import {
	type Post,
	type Message as APIMessage,
} from "@j0code/threadlet-api/v0/types"
import { api } from "../main"
import Component from "./Component"
import { MatrixEvent } from "matrix-js-sdk"
import { renderEvent } from "./events/Event"

export default class EventList extends Component {

	constructor() {
		super("div", { id: `events` })
	}

	async reset(events: MatrixEvent[]) {
		for (let child of Array.from(this.element.children)) {
			child.remove()
		}

		for (let event of events) {
			this.pushMessage(event)
		}

		this.element.scrollTop = this.element.scrollHeight
	}

	pushMessage(event: MatrixEvent) {
		const autoscroll = this.element.scrollTop + this.element.clientHeight >= this.element.scrollHeight - 10

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
