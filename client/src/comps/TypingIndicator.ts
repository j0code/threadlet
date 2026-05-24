import { RoomMember } from "matrix-js-sdk"
import Component from "./Component"
import Avatar from "./Avatar"
import { twemojiParse } from "../md"

export default class TypingIndicator extends Component {
	avatarsDiv: HTMLDivElement
	label: HTMLSpanElement

	constructor() {
		super("div", { id: "typing-indicator" })
		this.avatarsDiv = document.createElement("div")
		this.avatarsDiv.className = "typing-avatars"
		this.label = document.createElement("span")
		this.label.className = "typing-label"
		this.element.appendChild(this.avatarsDiv)
		this.element.appendChild(this.label)
	}

	reset(users: RoomMember[]) {
		this.avatarsDiv.innerHTML = ""
		for (const user of users.toReversed()) {
			const avatar = new Avatar(user.userId, "typing-avatar")
			this.avatarsDiv.appendChild(avatar.element)
		}
		this.renderLabel(users, this.label)
	}

	renderLabel(users: RoomMember[], label: HTMLSpanElement) {
		label.innerHTML = ""
		if (users.length === 0) return
		if (users.length === 1) {
			label.appendChild(this.createLabelPart(users[0].name, "typing-user"))
			label.appendChild(this.createLabelPart(" is typing..."))
		} else if (users.length === 2) {
			label.appendChild(this.createLabelPart(users[0].name, "typing-user"))
			label.appendChild(this.createLabelPart(" and "))
			label.appendChild(this.createLabelPart(users[1].name, "typing-user"))
			label.appendChild(this.createLabelPart(" are typing..."))
		} else if (users.length === 3) {
			label.appendChild(this.createLabelPart(users[0].name, "typing-user"))
			label.appendChild(this.createLabelPart(", "))
			label.appendChild(this.createLabelPart(users[1].name, "typing-user"))
			label.appendChild(this.createLabelPart(" and "))
			label.appendChild(this.createLabelPart(users[2].name, "typing-user"))
			label.appendChild(this.createLabelPart(" are typing..."))
		} else {
			label.appendChild(this.createLabelPart(users[0].name, "typing-user"))
			label.appendChild(this.createLabelPart(" and "))
			label.appendChild(this.createLabelPart(`${users.length - 1} others`, "typing-user"))
			label.appendChild(this.createLabelPart(" are typing..."))
		}
	}

	private createLabelPart(text: string, className?: string) {
		const span = document.createElement("span")
		span.innerHTML = twemojiParse(text)
		if (className) span.className = className
		return span
	}
}
