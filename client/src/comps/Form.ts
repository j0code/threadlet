import Component from "./Component";

export default class Form extends Component {

	public readonly body: HTMLDivElement
	public readonly titleElement: HTMLSpanElement

	constructor(id: string, title: string) {
		super("div", id, "form")

		this.titleElement = document.createElement("span")
		this.titleElement.className = "form-title"
		this.titleElement.textContent = title
		const formHead  = document.createElement("div")
		formHead.className = "form-head"
		formHead.appendChild(this.titleElement)

		const formBody = document.createElement("div")
		formBody.className = "form-body"

		this.element.appendChild(formHead)
		this.element.appendChild(formBody)

		this.body = formBody
	}

}
