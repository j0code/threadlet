import { Tag } from "@j0code/threadlet-api/v0/types"
import Component from "./Component"

export default class TagList extends Component {

	constructor() {
		super("div", { classes: ["tag-list"] })
	}

	reset(tags: Tag[]) {
		this.element.innerHTML = ""

		for (let tag of tags) {
			const pill = document.createElement("span")
			pill.classList = "tag-pill"
			pill.textContent = tag.name

			this.element.append(pill)
		}
	}

}
