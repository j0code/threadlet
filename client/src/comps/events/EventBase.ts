import { MatrixEvent } from "matrix-js-sdk"
import Component from "../Component"
import Avatar from "../Avatar"

export default abstract class EventBase extends Component {
	readonly message: MatrixEvent
	readonly mainElement: HTMLDivElement
	readonly contentElement: HTMLDivElement
	readonly avatarElement: Avatar
	readonly timestampElement: HTMLTimeElement

	constructor(
		msg: MatrixEvent,
		tagName: keyof HTMLElementTagNameMap = "div",
		options: { id?: string; classes?: string[] } = {}
	) {
		super(tagName, options)
		this.message = msg

		this.contentElement = document.createElement("div")
		this.contentElement.className = "message-content md"

		this.avatarElement = new Avatar(msg.getSender()!, "message-author-avatar")

		this.timestampElement = document.createElement("time")
		this.timestampElement.className = "message-timestamp"

		const aside = document.createElement("div")
		aside.className = "message-aside"
		aside.append(this.avatarElement.element)

		this.mainElement = document.createElement("div")
		this.mainElement.className = "message-main"

		this.element.append(aside, this.mainElement)
		this.element.dataset.eventType = this.message.getType()
	}

	abstract reset(): Promise<void>
}
