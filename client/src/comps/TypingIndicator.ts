import { RoomMember } from "matrix-js-sdk"
import Component from "./Component"
import { twemojiParse } from "../md"
import AvatarList from "./AvatarList"

export default class TypingIndicator extends Component {
	avatarList: AvatarList
	label: HTMLSpanElement

	constructor() {
		super("div", { id: "typing-indicator" })
		this.avatarList = new AvatarList([], ["typing-avatar-list"])
		this.label = document.createElement("span")
		this.label.className = "typing-label"
		this.element.appendChild(this.avatarList.element)
		this.element.appendChild(this.label)
	}

	reset(users: RoomMember[]) {
		this.avatarList.reset(users.map(u => u.userId))
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
