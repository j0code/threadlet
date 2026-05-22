import { RoomMember } from "matrix-js-sdk"
import Component from "./Component"
import Avatar from "./Avatar"

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
		this.label.textContent = this.getLabel(users)
	}

	getLabel(users: RoomMember[]) {
		if (users.length === 0) return ""
		if (users.length === 1) return `${users[0].name} is typing...`
		if (users.length === 2)
			return `${users[0].name} and ${users[1].name} are typing...`
		if (users.length === 3)
			return `${users[0].name}, ${users[1].name} and ${users[2].name} are typing...`
		return `${users[0].name} and ${users.length - 1} others are typing...`
	}
}
