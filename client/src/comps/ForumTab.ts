import { twemojiParse } from "../md";
import Component from "./Component";

export default class ForumTab extends Component {

	constructor(forum: any) {
		super("div", { id: "tab-forum", classes: ["list-tab"] })

		this.element.innerHTML = twemojiParse(forum.name)
	}

}
