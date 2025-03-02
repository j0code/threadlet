import { Forum } from "@j0code/threadlet-api/v0/types";
import { app, views } from "../main";
import Component from "./Component";
import FormButton from "./FormButton";
import ForumTab from "./ForumTab";

export default class ChannelList extends Component {

	constructor(forums: Array<Forum>) {
		super("div", { id: "channels" })

		this.reset(forums)
	}

	reset(forums: Array<Forum>) {
		for (let child of Array.from(this.element.children)) {
			child.remove()
		}

		const createButton = new FormButton("create-forum-button", "(+) New", () => app.renderView(views.forumCreateForm))
		this.element.appendChild(createButton.element)
		
		for (let forum of forums) {
			const tab = new ForumTab(forum)
			tab.element.addEventListener("click", () => app.renderView(views.forumView, forum))
			this.element.appendChild(tab.element)
		}
	}

}
