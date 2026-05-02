import { Forum } from "@j0code/threadlet-api/v0/types";
import { twemojiParse } from "../md";
import Component from "./Component";

export default class ForumTab extends Component {

	constructor(forum: Forum) {
		super("div", { classes: ["list-tab"] })

		this.element.innerHTML = twemojiParse(forum.name)
	}

}
