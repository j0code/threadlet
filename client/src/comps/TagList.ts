import Component from "./Component"

export default class TagList extends Component {
	constructor() {
		super("div", { classes: ["tag-list"] })
	}

	reset(tags: unknown[]) {
		/*
		this.element.innerHTML = ""

		for (const tag of tags) {
			const pill = document.createElement("span")
			pill.classList = "tag-pill"
			pill.textContent = tag.name

			this.element.append(pill)
		}
		*/
	}
}
