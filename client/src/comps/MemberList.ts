import { RoomMember } from "matrix-js-sdk";
import Component from "./Component";
import MXCImage from "./MXCImage";
import Avatar from "./Avatar";
import FormButton from "./FormButton";
import { matrix } from "../matrix";
import Modal from "./Modal";
import RoomInviteForm from "./RoomInviteForm";

export default class MemberList extends Component {
	constructor() {
		super("div", { id: "members" })
	}

	async reset(members: RoomMember[], roomId?: string) {
		this.element.innerHTML = ""

		if(roomId) {
			const inviteButton = new FormButton("invite-to-room-button", "Invite", async () => {
				const inviteForm = new RoomInviteForm()
				const inviteModal = new Modal(inviteForm)
				inviteModal.reset(matrix.getRoom(roomId))
				inviteModal.show()
			})
			this.element.appendChild(inviteButton.element)
		}
		
		members.forEach(member => {
			const memberEl = document.createElement("div")
			memberEl.className = "member"
			const avatar = new Avatar(member.userId, "member-avatar")
			memberEl.appendChild(avatar.element)
			const nameEl = document.createElement("span")
			nameEl.className = "member-name"
			nameEl.textContent = member.name || member.userId
			memberEl.appendChild(nameEl)
			this.element.appendChild(memberEl)
		})
	}
}