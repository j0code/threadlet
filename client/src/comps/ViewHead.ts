import Component from "./Component"

export default class ViewHead extends Component {

	titleElement: HTMLSpanElement;

	constructor(title: string) {
		super("div", { classes: ["view-head"] })

		this.titleElement = document.createElement("span")
		this.titleElement.className = "view-title"
		this.titleElement.textContent = title

		this.element.appendChild(this.titleElement)
		
	}

	reset(title: string) {
		this.titleElement.textContent = title
	}

}
