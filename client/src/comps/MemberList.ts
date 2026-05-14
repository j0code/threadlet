import { RoomMember } from "matrix-js-sdk"
import Component from "./Component"
import FormButton from "./FormButton"
import { matrix } from "../matrix"
import Member from "./Member"
import { modals } from "../main"

export default class MemberList extends Component {
	constructor() {
		super("div", { id: "members" })
	}

	reset(members: RoomMember[], roomId?: string) {
		this.element.innerHTML = ""

		if (roomId) {
			const inviteButton = new FormButton(
				"invite-to-room-button",
				"Invite",
				() => {
					modals.inviteModal.show(matrix.getRoom(roomId));
				}
			)
			this.element.appendChild(inviteButton.element)
		}

		members.forEach(member => {
			const memberEl = new Member()
			memberEl.reset(member)
			this.element.appendChild(memberEl.element)
		})
	}
}
