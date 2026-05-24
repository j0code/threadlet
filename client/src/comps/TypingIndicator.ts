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
		for (const user of users.toReversed().slice(0, 3)) {
			const avatar = new Avatar(user.userId, "typing-avatar")
			this.avatarsDiv.appendChild(avatar.element)
		}
		this.label.innerHTML = this.renderLabel(users)
	}

	renderLabel(users: RoomMember[]) {
		const names = users.map(u => `<span class="typing-user">${twemojiParse(u.name)}</span>`)
		if (users.length === 0) return ""
		if (users.length === 1)
			return `${names[0]} is typing...`
		if (users.length === 2)
			return `${names[0]} and ${names[1]} are typing...`
		if (users.length === 3)
			return `${names[0]}, ${names[1]}, and ${names[2]} are typing...`
		return `${names[0]} and <span class="typing-user">${users.length - 1} others</span> are typing...`
	}
}
