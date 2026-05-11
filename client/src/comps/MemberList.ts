import { RoomMember } from "matrix-js-sdk";
import Component from "./Component";
import FormButton from "./FormButton";
import { matrix } from "../matrix";
import Modal from "./Modal";
import RoomInviteForm from "./RoomInviteForm";
import Member from "./Member";

export default class MemberList extends Component {
	constructor() {
		super("div", { id: "members" })
	}

	reset(members: RoomMember[], roomId?: string) {
		this.element.innerHTML = ""

		if(roomId) {
			const inviteButton = new FormButton("invite-to-room-button", "Invite", () => {
				const inviteForm = new RoomInviteForm()
				const inviteModal = new Modal(inviteForm)
				inviteModal.reset(matrix.getRoom(roomId))
				inviteModal.show()
			})
			this.element.appendChild(inviteButton.element)
		}
		
		members.forEach(member => {
			const memberEl = new Member()
			memberEl.reset(member)
			this.element.appendChild(memberEl.element)
		})
	}
}