import { app, views } from "../main";
import Component from "./Component";
import FormButton from "./FormButton";
import ForumTab from "./ForumTab";
import { Room } from "matrix-js-sdk";
import App from "./App";

export default class RoomList extends Component {

	constructor(rooms: Array<Room>) {
		super("div", { id: "channels" })

		this.reset(rooms)
	}

	reset(rooms: Array<Room>) {
		for (const child of Array.from(this.element.children)) {
			child.remove()
		}
		if(!(app instanceof App)) {
			// How did we get here
			return
		}

		const _app = app satisfies App

		const createButton = new FormButton("create-forum-button", "(+) New", () => _app.renderView(views.roomCreateForm))
		this.element.appendChild(createButton.element)
		
		for (const forum of rooms.filter(r => r.getMyMembership() != "leave")) {
			const tab = new ForumTab(forum)
			tab.tab.addEventListener("click", () => {
				const membership = forum.getMyMembership()
				_app.renderView(membership == "join" ? views.roomView : views.roomInviteView, forum)
				void _app.updateMemberList(forum)
			})
			this.element.appendChild(tab.element)
		}
	}
}
