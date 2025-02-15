import { app, views } from "../main";
import Component from "./Component";
import FormButton from "./FormButton";
import ForumTab from "./ForumTab";

export default class ChannelList extends Component {

	constructor(forums: Array<any>) {
		super("div", "channels")

		this.update(forums)
	}

	update(forums: Array<any>) {
		for (let child of Array.from(this.element.children)) {
			child.remove()
		}

		const createButton = new FormButton("create-forum-button", "(+) New", () => app.renderView(views.forumCreateForm))
		this.element.appendChild(createButton.element)
		
		for (let forum of forums) {
			this.element.appendChild(new ForumTab(forum).element)
		}
	}

}
