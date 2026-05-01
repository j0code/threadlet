import { Forum } from "@j0code/threadlet-api/v0/types";
import { app, views } from "../main";
import Component from "./Component";
import FormButton from "./FormButton";
import ForumTab from "./ForumTab";
import { Room } from "matrix-js-sdk";
import App from "./App";

export default class ChannelList extends Component {

	constructor(rooms: Array<Room>) {
		super("div", { id: "channels" })

		this.reset(rooms)
	}

	reset(forums: Array<Room>) {
		for (let child of Array.from(this.element.children)) {
			child.remove()
		}
		if(!(app instanceof App)) {
			// How did we get here
			return
		}

		let _app = app satisfies App

		const createButton = new FormButton("create-forum-button", "(+) New", () => _app.renderView(views.forumCreateForm))
		this.element.appendChild(createButton.element)

		for (const forum of forums) {
			const tab = new ForumTab(forum)
			tab.element.addEventListener("click", () => _app.renderView(views.roomView, forum))
			this.element.appendChild(tab.element)
		}
	}
}
