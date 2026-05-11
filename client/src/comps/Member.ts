import { RoomMember } from "matrix-js-sdk"
import Avatar from "./Avatar"
import Component from "./Component"
import { twemojiParse } from "../md"

export default class Member extends Component {
	constructor() {
		super("div", { classes: ["member"] })
	}

	reset(member: RoomMember) {
		this.element.innerHTML = ""
		const avatar = new Avatar(member.userId, "member-avatar")
		this.element.appendChild(avatar.element)
		const name = document.createElement("span")
		name.className = "member-name"
		name.innerHTML = twemojiParse(
			member.name || member.userId || "Unknown"
		)
		this.element.appendChild(name)
	}
}