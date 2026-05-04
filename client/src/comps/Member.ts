import { RoomMember } from "matrix-js-sdk";
import Avatar from "./Avatar";
import Component from "./Component";

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
		name.textContent = member.name || member.userId
		this.element.appendChild(name)
	}
}