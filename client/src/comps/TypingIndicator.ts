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
		this.label.innerHTML = this.renderLabel(users)
	}

	renderLabel(users: RoomMember[]) {
		const names = users.map(u => twemojiParse(u.name))
		if (users.length === 0) return ""
		if (users.length === 1)
			return `<span class="typing-user">${names[0]}</span> is typing...`
		if (users.length === 2)
			return `<span class="typing-user">${names[0]}</span> and <span class="typing-user">${names[1]}</span> are typing...`
		if (users.length === 3)
			return `<span class="typing-user">${names[0]}</span>, <span class="typing-user">${names[1]}</span> and <span class="typing-user">${names[2]}</span> are typing...`
		return `<span class="typing-user">${names[0]}</span> and <span class="typing-user">${users.length - 1} others</span> are typing...`
	}
}
