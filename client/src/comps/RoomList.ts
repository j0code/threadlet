import { app, modals, views } from "../main"
import Component from "./Component"
import FormButton from "./FormButton"
import ForumTab from "./ForumTab"
import { Room } from "matrix-js-sdk"

export default class RoomList extends Component {
	constructor(rooms: Array<Room>) {
		super("div", { id: "channels" })

		this.reset(rooms)
	}

	reset(rooms: Array<Room>) {
		for (const child of Array.from(this.element.children)) {
			child.remove()
		}

		const createButton = new FormButton("create-forum-button", "(+) New", () =>
			app.renderView(views.roomCreateForm)
		)
		this.element.appendChild(createButton.element)

		for (const forum of rooms.filter(r => r.getMyMembership() != "leave")) {
			const tab = new ForumTab(forum)
			tab.tab.addEventListener("click", () => {
				const membership = forum.getMyMembership()
				//app.renderView(membership == "join" ? views.roomView : views.roomInviteView, forum)
				if (membership == "join") {
					app.renderView(views.roomView, forum)
				} else if (membership == "invite") {
					modals.roomInvitation.show(forum)
				}
			})
			this.element.appendChild(tab.element)
		}
	}
}
