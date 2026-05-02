import { RoomMember } from "matrix-js-sdk";
import Component from "./Component";
import MXCImage from "./MXCImage";
import Avatar from "./Avatar";
import FormButton from "./FormButton";
import { matrix } from "../matrix";

export default class MemberList extends Component {
	constructor() {
		super("div", { id: "members" })
	}

	async reset(members: RoomMember[], roomId?: string) {
		this.element.innerHTML = ""

		if(roomId) {
			const inviteButton = new FormButton("invite-to-room-button", "Invite", async () => {
				const user = prompt("Enter the MXID of the user you want to invite (e.g. @example:matrix.org)")
				if(!user) return
				await matrix.invite(roomId, user);
			})
			this.element.appendChild(inviteButton.element)
		}
		
		members.forEach(member => {
			const memberEl = document.createElement("div")
			memberEl.className = "member"
			const avatar = new Avatar(member.userId, "member-avatar")
			memberEl.appendChild(avatar.element)
			avatar.reset()
			const nameEl = document.createElement("span")
			nameEl.className = "member-name"
			nameEl.textContent = member.name || member.userId
			memberEl.appendChild(nameEl)
			this.element.appendChild(memberEl)
		})
	}
}